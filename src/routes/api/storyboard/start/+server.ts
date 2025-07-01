import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { concept } = await request.json();
	const state = await runStoryboardCreation(concept);

	const db = await initDB();
	const result = await db.collection('storyboards').insertOne({
		...state,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	return json({ ...state, _id: result.insertedId });
};
