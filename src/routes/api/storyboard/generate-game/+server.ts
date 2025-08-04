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
	const prompt = `Generate rich game interactions for each slide in this story. CRITICAL: Every slide MUST have at least 2-3 meaningful interactions.

INTERACTION TYPES:
- "click": User clicks on an object to trigger an action
- "choose": User selects from multiple choice options

CRITICAL REQUIREMENTS:
- EVERY slide MUST have at least 2 interactions minimum
- Each interaction must have clear, engaging feedback text
- Include sound effect names where appropriate (e.g., "water_spill.mp3", "door_creak.mp3")
- For choice interactions, provide 2-3 meaningful options with different outcomes
- Make interactions feel rewarding and story-driven
- If a slide has few detected objects, create generic interactions like "examine scene", "think about situation", "move forward"
- Always include at least one "narrative" interaction that advances the story

RESPONSE FORMAT:
Return ONLY valid JSON in this exact structure:
{
  "1": {
    "main-object": {
      "type": "click",
      "result": "Engaging description of what happens",
      "sound": "sound_effect.mp3"
    },
    "character-choice": {
      "type": "choose",
      "options": [
        {"text": "Option 1", "result": "Outcome description"},
        {"text": "Option 2", "result": "Different outcome"}
      ]
    },
    "scene-narrative": {
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
			slide.detectedObjects = await getBoundingBoxes(openai, slide.imageUrl);
			console.log('Detected objects for slide', slide.slideNumber, slide.detectedObjects);
		}
	}

	const htmlPrompt = `
You are a web game developer. Given the following story, game interactions, and detected object bounding boxes, generate a complete HTML file (with embedded CSS and JavaScript) that implements the game.

CRITICAL VISUAL REQUIREMENTS (must be implemented exactly):
- Use background-image CSS property for slide images, NOT <img> tags
- Interactive hotspots MUST have highly visible borders: "border: 3px solid rgba(255, 0, 0, 0.8)" with "background-color: rgba(255, 0, 0, 0.3)"
- All hotspots must have "cursor: pointer" and hover effects that make them even more visible
- Use "position: absolute" for all hotspots with precise positioning
- Ensure z-index values prevent hotspots from being hidden (minimum z-index: 100)

GAME STRUCTURE REQUIREMENTS:
- Display the corresponding image using background-image CSS (from the "imageUrl" field in the storyboard's "visualSlides")
- For each interaction, use the provided bounding box coordinates (in slide.detectedObjects) to position interactive elements precisely over the image
- CRITICAL: Every slide MUST have at least one interactive hotspot. If no detected objects exist for a slide, create a generic clickable area in the center with story-relevant text.
- The user should only be able to proceed to the next slide after successfully completing all required interactions for the current slide
- CRITICAL Z-INDEX SORTING: When rendering interactive boxes (hotspots), calculate area (width × height) for each box. Sort by area from largest to smallest. Assign z-index values starting from 100 for the largest box, incrementing by 10 for each smaller box. This ensures smaller boxes ALWAYS appear on top of larger boxes and remain clickable.
- Example: Large box (1000px²) gets z-index: 100, Medium box (500px²) gets z-index: 110, Small box (100px²) gets z-index: 120
- Add a "Hint" button for each slide that provides helpful guidance
- Include visual feedback when interactions are completed (e.g., change hotspot color to green)
- Show clear progress indicators: "Slide X of Y" and completion status for each slide
- Display a prominent "Next Slide" button that only appears after all interactions are completed
- After completing the final slide, show a "Game Complete!" message and a "Return to Storyboard" button that redirects to the parent page

TECHNICAL REQUIREMENTS:
- Use only vanilla JS, HTML, and CSS (no external dependencies)
- The game should be playable in an iframe
- Ensure responsive design that works on different screen sizes
- Add hover effects to make interactive elements more discoverable
- Include proper error handling for missing elements

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

	// Validate generated HTML contains required CSS classes and game flow elements
	const requiredElements = ['.hotspot', 'background-image:', 'rgba(255, 0, 0, 0.8)', 'z-index:', 'sort', 'currentSlide', 'totalSlides'];
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
