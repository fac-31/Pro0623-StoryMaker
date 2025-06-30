import { json } from '@sveltejs/kit';
import { submitRefinementFeedback } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';
import type { StoryboardState } from '$lib/langgraph/storyboardGraph';

export const POST: RequestHandler = async ({ request }) => {
	const { _id, feedback } = await request.json();
	const db = await initDB();
	const storyboards = db.collection('storyboards');

	const storyboard = await storyboards.findOne({ _id: new ObjectId(_id) });
	if (!storyboard) return json({ error: 'Storyboard not found' }, { status: 404 });

	// Apply feedback
	const updatedState = {
		...storyboard,
		...submitRefinementFeedback(storyboard as unknown as StoryboardState, feedback)
	};

	// Optionally, re-run the workflow for the next step if needed
	await storyboards.updateOne(
		{ _id: new ObjectId(_id) },
		{ $set: { ...updatedState, updatedAt: new Date() } }
	);

	return json({ ...updatedState, _id });
};
