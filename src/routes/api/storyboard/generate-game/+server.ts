import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import path from 'path';
import { buildGame } from '../../../../../scripts/build-game.js';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';

interface GenerateGameRequest {
	storyboardId: string;
}

// Helper function to get bounding boxes using OpenAI GPT-4o vision
async function getBoundingBoxes(openai, imageUrl) {
	const prompt = `You are an object detection assistant. For the image provided, list all distinct objects (e.g., characters, items, animals) and for each, return:\n- a label (e.g., \"Dino\", \"desk\", \"bird\")\n- a bounding box in the format {x, y, width, height} (pixel coordinates, origin top-left)\nReturn a JSON array, no explanations.`;

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
	} catch (e) {
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

	if (!env.OPENAI_API_KEY) return json({ error: 'OpenAI API key not configured' }, { status: 500 });

	const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	const prompt = `Generate rich game interactions for each slide in this story. Use drag, click, choose, or solve mechanics. Return ONLY valid JSON, with no explanations, markdown, or code fences. Story JSON:\n${JSON.stringify(storyboard.storyOutline)}`;

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

	const outputDir = path.join('static', 'games', storyboardId);

	// New: Ask OpenAI to generate the full HTML, CSS, and JS for the game
	const htmlPrompt = `
You are a web game developer. Given the following story, game interactions, and detected object bounding boxes, generate a complete HTML file (with embedded CSS and JavaScript) that implements the game. For each slide:
- Display the corresponding image (from the "imageUrl" field in the storyboard's "visualSlides").
- For each interaction, use the provided bounding box coordinates (in slide.detectedObjects) to position interactive elements (e.g., draggable, clickable, selectable, or puzzle) precisely over the image.
- Visually highlight all interactive areas on the image (e.g., with colored boxes, outlines, or hotspots) so the user knows where to interact.
- The user should only be able to proceed to the next slide after successfully completing all required interactions for the current slide.
- Add a "Hint" button for each interaction. If a hint is not provided in the data, generate a helpful hint based on the interaction description.
- Use only vanilla JS, HTML, and CSS (no external dependencies).
- The game should be playable in an iframe.
- Do not include explanations or markdown, just return the raw HTML.

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

	await fs.promises.mkdir(outputDir, { recursive: true });
	await fs.promises.writeFile(path.join(outputDir, 'index.html'), generatedHtml);

	return json({ success: true, gamePath: `/games/${storyboardId}/index.html` });
};
