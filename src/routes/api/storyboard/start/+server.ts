import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const POST = async ({ request }) => {
  const { concept } = await request.json();
  const state = await runStoryboardCreation(concept);

  const db = await initDB();
  const result = await db.collection('storyboards').insertOne({
    ...state,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return json({ ...state, _id: result.insertedId });
}; 