// import { json } from '@sveltejs/kit';
// import { approveSlideForGeneration } from '$lib/langgraph/storyboardGraph';
// import { initDB } from '$lib/server/db';
// import { ObjectId } from 'mongodb';
// import type { RequestHandler } from '@sveltejs/kit';

// export const POST: RequestHandler = async ({ request }) => {
// 	const { _id } = await request.json();
// 	const db = await initDB();
// 	const storyboards = db.collection('storyboards');

// 	const storyboard = await storyboards.findOne({ _id: new ObjectId(_id) });
// 	if (!storyboard) return json({ error: 'Storyboard not found' }, { status: 404 });

// 	// Approve slide
// 	const updatedState = { ...storyboard, ...approveSlideForGeneration() };

// 	await storyboards.updateOne(
// 		{ _id: new ObjectId(_id) },
// 		{ $set: { ...updatedState, updatedAt: new Date() } }
// 	);

// 	return json({ ...updatedState, _id });
// };
