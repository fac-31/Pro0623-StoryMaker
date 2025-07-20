import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import path from 'path';
import { buildGame } from '../../../../../scripts/build-game.js';
import type { RequestHandler } from '@sveltejs/kit';

interface GenerateGameRequest {
	storyboardId: string;
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
	const prompt = `Generate rich game interactions for each slide in this story. Use drag, click, choose, or solve mechanics. Return structured JSON that links each interaction to a scene. Story JSON:\n${JSON.stringify(storyboard.storyOutline)}`;

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [{ role: 'user', content: prompt }],
		temperature: 0.5
	});

	const raw = completion.choices[0]?.message?.content || '{}';
	let interactions: unknown;
	try {
		interactions = JSON.parse(raw);
	} catch {
		return json({ error: 'Failed to parse OpenAI response' }, { status: 500 });
	}

	const outputDir = path.join('static', 'games', storyboardId);
	await buildGame({ storyboard, interactions, outputDir });

	return json({ success: true, gamePath: `/games/${storyboardId}/index.html` });
};
