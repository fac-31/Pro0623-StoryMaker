import { ObjectId } from 'mongodb';
import { getDB } from './db';
import type { User } from '$lib/models/user.model';
import type { Storyboard } from '$lib/models/storyboard.model';
import { serializeMongoDocument } from '$lib/server/utils.js';

/**
 * Retrieves the IDs of all storyboards in the database.
 * @returns {Promise<string[]>} A promise that resolves to an array of storyboard IDs.
 * @throws {Error} If the database find operation fails.
 */
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

/**
 * Retrieves all storyboards from given list of ids
 * @param {stirng[]} ids - List of ids to collect.
 * @returns {Promise<Storyboard[]>} A promise that resolves to an array of Storyboard objects.
 * @throws {Error} If the database find operation fails.
 */
export async function getStoryboardsFromIds(ids: string[]): Promise<Storyboard[]> {
	const db = getDB();

	try {
		const storyboardsCollection = db.collection('storyboards');

		const storyboards = await storyboardsCollection
			.find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
			.toArray();

		const serialized = serializeMongoDocument(storyboards);
		return serialized as Storyboard[];
	} catch (err) {
		console.error('Failed to get all storyboards:', err);
		throw new Error('Database find failed');
	}
}
