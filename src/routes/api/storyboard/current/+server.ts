import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const GET = async ({ url }) => {
  const _id = url.searchParams.get('_id');
  if (!_id) return json({ error: 'Missing _id parameter' }, { status: 400 });

  const db = await initDB();
  const storyboard = await db.collection('storyboards').findOne({ _id: new ObjectId(_id) });
  if (!storyboard) return json({ error: 'Storyboard not found' }, { status: 404 });

  return json(storyboard);
}; 