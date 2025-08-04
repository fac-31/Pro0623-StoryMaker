import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';

interface GenerateGameRequest {
	storyboardId: string;
}

// Helper function to select the best bounding boxes for gameplay
function selectBestBoundingBoxes(detectedObjects: any[], maxCount: number) {
	if (!detectedObjects || detectedObjects.length === 0) {
		return [];
	}

	// Score each bounding box based on size, position, and suitability for interaction
	const scoredObjects = detectedObjects.map((obj) => {
		const area = (obj.width || 50) * (obj.height || 50);
		const centerX = (obj.x || 0) + (obj.width || 50) / 2;
		const centerY = (obj.y || 0) + (obj.height || 50) / 2;

		// Prefer objects that are:
		// 1. Reasonably sized (not too small, not too large)
		// 2. Not too close to edges
		// 3. Have clear labels
		let score = 0;

		// Size score: prefer medium-sized objects (between 1000-10000 px²)
		if (area >= 1000 && area <= 10000) {
			score += 3;
		} else if (area >= 500 && area <= 20000) {
			score += 2;
		} else if (area >= 100) {
			score += 1;
		}

		// Position score: prefer objects not too close to edges (assuming 800x600 image)
		if (centerX > 100 && centerX < 700 && centerY > 100 && centerY < 500) {
			score += 2;
		}

		// Label quality score: prefer objects with meaningful labels
		const label = obj.label || '';
		if (label.length > 3 && !label.toLowerCase().includes('unknown')) {
			score += 2;
		}

		return { ...obj, score };
	});

	// Sort by score (highest first) and take the best ones
	return scoredObjects
		.sort((a, b) => b.score - a.score)
		.slice(0, maxCount)
		.map(({ score, ...obj }) => obj); // Remove score from final object
}

// Helper function to get bounding boxes using OpenAI GPT-4o vision
async function getBoundingBoxes(openai: OpenAI, imageUrl: string) {
	const prompt = `You are an object detection assistant. For the image provided, list all distinct objects (e.g., characters, items, animals) and for each, return:
- a label (e.g., "Dino", "desk", "bird")
- a bounding box in the format {x, y, width, height} (pixel coordinates, origin top-left)
Return a JSON array, no explanations.`;

	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{ role: 'system', content: prompt },
			{
				role: 'user',
				content: [
					{ type: 'text', text: 'Here is the image:' },
					{ type: 'image_url', image_url: { url: imageUrl } }
				]
			}
		],
		temperature: 0.2
	});

	const content = response.choices[0]?.message?.content || '[]';
	let objects = [];
	try {
		objects = JSON.parse(content.replace(/```json|```/g, '').trim());
	} catch {
		console.error('Failed to parse bounding box JSON:', content);
	}
	return objects;
}

export const POST: RequestHandler = async ({ request }) => {
	const { storyboardId } = (await request.json()) as GenerateGameRequest;
	if (!storyboardId) return json({ error: 'Missing storyboardId' }, { status: 400 });

	const db = await initDB();
	const storyboard = await db
		.collection('storyboards')
		.findOne({ _id: new ObjectId(storyboardId) });
	if (!storyboard) return json({ error: 'Storyboard not found' }, { status: 404 });

	const outputDir = path.join('static', 'games', storyboardId);

	// --- Check if game is already generated ---
	if (storyboard.gameHtml) {
		console.log('Serving previously generated game from DB.');
		await fs.promises.mkdir(outputDir, { recursive: true });
		await fs.promises.writeFile(path.join(outputDir, 'index.html'), storyboard.gameHtml);
		return json({ success: true, gamePath: `/games/${storyboardId}/index.html` });
	}

	// --- Continue with generation if not found ---

	if (!env.OPENAI_API_KEY) return json({ error: 'OpenAI API key not configured' }, { status: 500 });

	const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	const prompt = `Generate exactly 3 meaningful interactions for each slide in this story. Each slide will have exactly 3 bounding boxes to interact with.

INTERACTION TYPES:
- "click": User clicks on an object to trigger an action
- "choose": User selects from multiple choice options

CRITICAL REQUIREMENTS:
- EVERY slide MUST have EXACTLY 3 interactions (no more, no less)
- Each interaction must have clear, engaging feedback text
- Include sound effect names where appropriate (e.g., "water_spill.mp3", "door_creak.mp3") 
- For choice interactions, provide 2-3 meaningful options with different outcomes
- Make interactions feel rewarding and story-driven
- Include mix of interaction types: at least 1 "click" and 1 "choose" per slide
- Always include at least one "narrative" interaction that advances the story

RESPONSE FORMAT:
Return ONLY valid JSON with exactly 3 interactions per slide:
{
  "1": {
    "interaction-1": {
      "type": "click",
      "result": "Engaging description of what happens",
      "sound": "sound_effect.mp3"
    },
    "interaction-2": {
      "type": "choose", 
      "options": [
        {"text": "Option 1", "result": "Outcome description"},
        {"text": "Option 2", "result": "Different outcome"}
      ]
    },
    "interaction-3": {
      "type": "click",
      "result": "Story progression text that moves the narrative forward"
    }
  },
  "2": { ... }
}

Story Slides Count: ${storyboard.visualSlides.length}
Story JSON:\n${JSON.stringify(storyboard.storyOutline)}`;

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [{ role: 'user', content: prompt }],
		temperature: 0.5
	});

	const raw = completion.choices[0]?.message?.content || '{}';
	console.log('OpenAI raw response:', raw); // <-- log raw response
	let interactions: unknown;
	try {
		// Remove code fences if present
		const cleaned = raw.replace(/```json|```/g, '').trim();
		interactions = JSON.parse(cleaned);
	} catch {
		return json({ error: 'Failed to parse OpenAI response' }, { status: 500 });
	}

	// For each slide, get bounding boxes and attach to slide.detectedObjects
	for (const slide of storyboard.visualSlides) {
		if (slide.imageUrl) {
			const allDetectedObjects = await getBoundingBoxes(openai, slide.imageUrl);
			// Limit to max 3 best objects per slide - prioritize larger, more central objects
			slide.detectedObjects = selectBestBoundingBoxes(allDetectedObjects, 3);
			console.log('Selected objects for slide', slide.slideNumber, slide.detectedObjects);
		}
	}

	const htmlPrompt = `
You are a web game developer. Given the following story, game interactions, and detected object bounding boxes, generate a complete HTML file (with embedded CSS and JavaScript) that implements the game.

CRITICAL INTERACTION MAPPING (STREAMLINED):
- Each slide has EXACTLY 3 bounding boxes and EXACTLY 3 corresponding interactions
- Create hotspots using the bounding box coordinates from detectedObjects (limited to 3 per slide)
- Map the first bounding box to "interaction-1", second to "interaction-2", third to "interaction-3"
- When a hotspot is clicked, display the interaction result text in a visible dialog/popup or text area
- For "choose" type interactions, show the options as buttons and display the selected result
- This streamlined approach ensures clean, focused gameplay with exactly 3 interactive elements per slide

CRITICAL VISUAL REQUIREMENTS (must be implemented exactly):
- Use background-image CSS property for slide images, NOT <img> tags
- Interactive hotspots MUST have highly visible borders: "border: 3px solid rgba(255, 0, 0, 0.8)" with "background-color: rgba(255, 0, 0, 0.3)"
- All hotspots must have "cursor: pointer" and hover effects that make them even more visible
- Use "position: absolute" for all hotspots with precise positioning
- Ensure z-index values prevent hotspots from being hidden (minimum z-index: 100)

GAME STRUCTURE REQUIREMENTS:
- Display the corresponding image using background-image CSS (from the "imageUrl" field in the storyboard's "visualSlides")
- For each interaction, use the provided bounding box coordinates (in slide.detectedObjects) to position interactive elements precisely over the image
- CRITICAL: Every slide has EXACTLY 3 interactive hotspots. The system automatically selects the 3 best bounding boxes per slide.
- The user should only be able to proceed to the next slide after successfully completing all required interactions for the current slide
- CRITICAL Z-INDEX SORTING: When rendering interactive boxes (hotspots), calculate area (width × height) for each box. Sort by area from largest to smallest. Assign z-index values starting from 100 for the largest box, incrementing by 10 for each smaller box. This ensures smaller boxes ALWAYS appear on top of larger boxes and remain clickable.
- Example: Large box (1000px²) gets z-index: 100, Medium box (500px²) gets z-index: 110, Small box (100px²) gets z-index: 120
- Add a "Hint" button for each slide that provides helpful guidance
- Include visual feedback when interactions are completed (e.g., change hotspot color to green)
- Show clear progress indicators: "Slide X of Y" and completion status for each slide
- Display a prominent "Next Slide" button that only appears after all interactions are completed
- After completing the final slide, show a "Game Complete!" message and a "Return to Storyboard" button that redirects to the parent page

CRITICAL INTERACTION IMPLEMENTATION:
- Create hotspots using detectedObjects coordinates: style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
- Assign each hotspot a data-interaction attribute matching the interaction keys from the INTERACTIONS JSON
- In the click handler, look up the interaction using: interactionData[currentSlide][interactionKey]
- For "click" type: call showInteractionResult(interaction.result) to display the text
- For "choose" type: call showChoiceOptions(interaction.options, currentSlide, interactionKey) to show choice buttons
- EXAMPLE: <div class="hotspot" data-interaction="main-object" onclick="handleClick('main-object')" ...>

TECHNICAL REQUIREMENTS:
- Use only vanilla JS, HTML, and CSS (no external dependencies)
- The game should be playable in an iframe  
- Ensure responsive design that works on different screen sizes
- Add hover effects to make interactive elements more discoverable
- Include proper error handling for missing elements
- MUST implement all the JavaScript functions provided in the templates above

CSS STYLING TEMPLATE (use this exact styling for hotspots):
.hotspot {
    position: absolute;
    border: 3px solid rgba(255, 0, 0, 0.8);
    background-color: rgba(255, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
}
.hotspot:hover {
    border: 3px solid rgba(255, 0, 0, 1.0);
    background-color: rgba(255, 0, 0, 0.5);
    transform: scale(1.05);
}
.hotspot.completed {
    border: 3px solid rgba(0, 255, 0, 0.8);
    background-color: rgba(0, 255, 0, 0.3);
}

JAVASCRIPT TEMPLATES (implement these):

// Z-INDEX SORTING LOGIC:
const sortedObjects = detectedObjects.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA; // Largest first
});

// Assign z-index values: largest gets 100, each smaller gets +10
sortedObjects.forEach((obj, index) => {
    const zIndex = 100 + (index * 10);
    hotspot.style.zIndex = zIndex;
});

// GAME COMPLETION LOGIC:
function checkGameCompletion() {
    if (currentSlide >= totalSlides) {
        showGameComplete();
    } else {
        showNextSlideButton();
    }
}

function showGameComplete() {
    document.body.innerHTML += \`
        <div id="game-complete" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
             background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; padding: 40px; border-radius: 10px; text-align: center;">
                <h1>🎉 Game Complete!</h1>
                <p>Congratulations! You've completed the interactive story.</p>
                <button onclick="returnToStoryboard()" style="padding: 15px 30px; font-size: 18px; 
                       background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Return to Storyboard
                </button>
            </div>
        </div>
    \`;
}

function returnToStoryboard() {
    if (window.parent !== window) {
        // If in iframe, try to communicate with parent
        window.parent.postMessage('gameComplete', '*');
    }
    // Fallback: go back in browser history
    setTimeout(() => { window.history.back(); }, 100);
}

// INTERACTION DISPLAY LOGIC:
function showInteractionResult(result, isChoice = false) {
    // Create or update result display area
    let resultArea = document.getElementById('interaction-result');
    if (!resultArea) {
        resultArea = document.createElement('div');
        resultArea.id = 'interaction-result';
        resultArea.style.cssText = \`
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: white; padding: 20px; border-radius: 10px;
            max-width: 80%; text-align: center; z-index: 1000; font-size: 16px;
        \`;
        document.body.appendChild(resultArea);
    }
    
    resultArea.innerHTML = \`
        <p>\${result}</p>
        <button onclick="closeInteractionResult()" style="
            margin-top: 10px; padding: 5px 15px; background: #007bff; 
            color: white; border: none; border-radius: 5px; cursor: pointer;">
            Continue
        </button>
    \`;
    resultArea.style.display = 'block';
}

function closeInteractionResult() {
    const resultArea = document.getElementById('interaction-result');
    if (resultArea) resultArea.style.display = 'none';
}

function showChoiceOptions(options, slideNum, interactionKey) {
    let choiceArea = document.getElementById('choice-options');
    if (!choiceArea) {
        choiceArea = document.createElement('div');
        choiceArea.id = 'choice-options';
        choiceArea.style.cssText = \`
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: white; padding: 20px; border-radius: 10px;
            max-width: 80%; text-align: center; z-index: 1000;
        \`;
        document.body.appendChild(choiceArea);
    }
    
    const buttons = options.map((option, index) => 
        \`<button onclick="selectChoice(\${slideNum}, '\${interactionKey}', \${index})" style="
            display: block; margin: 10px auto; padding: 10px 20px; background: #28a745; 
            color: white; border: none; border-radius: 5px; cursor: pointer; min-width: 200px;">
            \${option.text}
        </button>\`
    ).join('');
    
    choiceArea.innerHTML = \`<p>Choose your action:</p>\${buttons}\`;
    choiceArea.style.display = 'block';
}

function selectChoice(slideNum, interactionKey, optionIndex) {
    const interaction = interactionData[slideNum][interactionKey];
    const selectedOption = interaction.options[optionIndex];
    
    document.getElementById('choice-options').style.display = 'none';
    showInteractionResult(selectedOption.result);
    
    // Mark interaction as completed
    interactionsCompleted[slideNum][interactionKey] = true;
    checkSlideCompletion();
}

Do not include explanations or markdown, just return the raw HTML.

STORY JSON:
${JSON.stringify(storyboard, null, 2)}

INTERACTIONS JSON:
${JSON.stringify(interactions, null, 2)}
`;

	const htmlCompletion = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [{ role: 'user', content: htmlPrompt }],
		temperature: 0.3
	});

	let generatedHtml = htmlCompletion.choices[0]?.message?.content || '';
	// Remove code fences if present
	generatedHtml = generatedHtml.replace(/```html|```/g, '').trim();

	// Validate generated HTML contains required CSS classes and interaction functions
	const requiredElements = [
		'.hotspot',
		'background-image:',
		'rgba(255, 0, 0, 0.8)',
		'z-index:',
		'sort',
		'currentSlide',
		'totalSlides',
		'showInteractionResult',
		'data-interaction'
	];
	const hasRequiredElements = requiredElements.every((element) => generatedHtml.includes(element));

	if (!hasRequiredElements) {
		console.warn('Generated HTML missing required elements, regenerating...');
		// Retry with more explicit instructions
		const retryPrompt =
			htmlPrompt +
			`

IMPORTANT: The previous generation was incomplete. You MUST include:
1. CSS class ".hotspot" with exact styling provided
2. background-image CSS property for images
3. Highly visible red borders with rgba(255, 0, 0, 0.8)
4. Proper z-index sorting logic using JavaScript (larger boxes get lower z-index, smaller boxes get higher z-index)
5. JavaScript that sorts detected objects by area and assigns z-index values accordingly
6. Hover effects for all interactive elements
7. Clear slide progression with currentSlide and totalSlides variables
8. Prominent "Next Slide" button that appears after completing all interactions
9. Game completion screen with "Return to Storyboard" button
10. Progress indicator showing "Slide X of Y"
11. Every slide must have at least one interactive hotspot`;

		const retryCompletion = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: retryPrompt }],
			temperature: 0.1 // Lower temperature for more consistent output
		});

		generatedHtml = retryCompletion.choices[0]?.message?.content || generatedHtml;
		generatedHtml = generatedHtml.replace(/```html|```/g, '').trim();
	}

	await fs.promises.mkdir(outputDir, { recursive: true });
	await fs.promises.writeFile(path.join(outputDir, 'index.html'), generatedHtml);

	// --- Save the generated game back to the database ---
	await db.collection('storyboards').updateOne(
		{ _id: new ObjectId(storyboardId) },
		{
			$set: {
				interactions: interactions,
				gameHtml: generatedHtml,
				updatedAt: new Date()
			}
		}
	);

	console.log('Saved generated game to the database.');

	return json({ success: true, gamePath: `/games/${storyboardId}/index.html` });
};
