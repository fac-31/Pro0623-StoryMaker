import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';

export const POST: RequestHandler = async ({ request }) => {

	const userConcept: UserPrompt = await request.json();
	const storyboardOutput = await runStoryboardCreation(userConcept);

	const db = await initDB();
	const result = await db.collection('storyboards').insertOne({
		...storyboardOutput,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	return json({ ...storyboardOutput, _id: result.insertedId });
};
