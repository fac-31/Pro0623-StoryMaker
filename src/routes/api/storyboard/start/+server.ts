import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import type { NewStoryboard } from '$lib/models/storyboard.model';

export const POST: RequestHandler = async ({ request }) => {
	const prompts: UserPrompt = await request.json();

	const storyboard: NewStoryboard = { prompts };

	const db = await initDB();
	const result = await db.collection('storyboards').insertOne(storyboard);

	if (!result.acknowledged) {
		return json({ error: 'Failed to save storyboard' }, { status: 500 });
	}

	return json(result);
};
