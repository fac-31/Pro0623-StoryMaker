import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import type { StoryboardResponse } from '$lib/langgraph/storyboardGraph';

export const POST: RequestHandler = async ({ request }) => {
	const userConcept: UserPrompt = await request.json();
	const storyboardOutput = await runStoryboardCreation(userConcept);

	const db = await initDB();
	const result = await db.collection('storyboards').insertOne(storyboardOutput);

	if (!result.acknowledged) {
		return json({ error: 'Failed to save storyboard' }, { status: 500 });
	}

	const storyboardResponse: StoryboardResponse = {
		storyboardOutput: storyboardOutput,
		_id: result.insertedId.toString() // Convert ObjectId to string for JSON response
	};

	return json(storyboardResponse);
};
