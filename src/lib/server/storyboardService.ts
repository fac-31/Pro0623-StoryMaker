import { ObjectId } from 'mongodb';
import { getDB } from './db';
import type { User } from '$lib/models/user.model';
import type { Storyboard } from '$lib/models/storyboard.model';
import { serializeMongoDocument } from '$lib/server/utils.js';

export async function getAllStoryboardsIds(): Promise<string[]> {
	const db = getDB();
	const collection = db.collection('storyboards');

	try {
		const storyboards = await collection.find({}, { projection: { _id: 1 } }).toArray();
		return storyboards.map((storyboard) => storyboard._id.toString());
	} catch (err) {
		console.error('Failed to get all storyboards:', err);
		throw new Error('Database find failed');
	}
}

export async function getStoryboardsOfUser(supabaseUserId: string): Promise<Storyboard[]> {
	const db = getDB();

	try {
		const userDoc = await await db.collection('users').findOne({
			supabase: supabaseUserId // Use supabase field
		});
		const user = userDoc as User;
		if (!user) {
			console.log('User not found:', supabaseUserId);
			return [];
		}

		const storyboardsCollection = db.collection('storyboards');

		const storyboards = await storyboardsCollection
			.find({ _id: { $in: user.projects.map((id) => new ObjectId(id)) } })
			.toArray();

		const serialized = serializeMongoDocument(storyboards);
		return serialized as Storyboard[];
	} catch (err) {
		console.error('Failed to get all storyboards:', err);
		throw new Error('Database find failed');
	}
}
