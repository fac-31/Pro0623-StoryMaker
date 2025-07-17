import type { InsertOneResult } from 'mongodb';
import type { RequestEvent } from '@sveltejs/kit';
import { getDB } from './db';

import type { User, NewUser, SafeUser } from '$lib/models/user.model';
import { serializeMongoDocument } from '$lib/server/utils.js';

/**
 * Inserts a new user into the database.
 * @param {string} supabase - The Supabase ID of the user.
 * @param {string} name - The name of the user.
 * @returns {Promise&lt;InsertOneResult&gt;} A promise that resolves to the result of the insert operation.
 * @throws {Error} If the database insert operation fails.
 */
export async function insertUser(supabase: string, name: string): Promise<InsertOneResult> {
	const db = getDB();
	const users = db.collection<NewUser>('users');

	try {
		const user: NewUser = {
			supabase: supabase,
			name: name,
			projects: [],
			teams: []
		};

		return await users.insertOne(user);
	} catch (err) {
		console.error('Failed to insert user:', err);
		throw new Error('Database insert failed');
	}
}

/**
 * Retrieves all users from the database.
 * @returns {Promise&lt;User[]&gt;} A promise that resolves to an array of all users.
 * @throws {Error} If the database find operation fails.
 */
export async function getAllUsers(): Promise<User[]> {
	const db = getDB();
	const users = db.collection<User>('users');

	try {
		const result = await users.find({}).toArray();
		const serialized = serializeMongoDocument(result);
		return serialized as User[];
	} catch (err) {
		// Should be expecting every supabase users have mongodb user?
		console.error('Failed to get all users:', err);
		throw new Error('Database find failed');
	}
}

/**
 * Retrieves a user from the database based on the Supabase ID in the request event.
 * @param {RequestEvent} event - The request event containing the user information.
 * @returns {Promise&lt;User | null&gt;} A promise that resolves to the user object if found, or null if not found.
 * @throws {Error} If the database find operation fails.
 */
export async function getUserFromEvent(event: RequestEvent): Promise<User | null> {
	const supabase = event.locals.user;
	if (!supabase) return null;

	return await getUserFromSupabaseId(supabase.id);
}

/**
 * Retrieves a user from the database based on the Supabase ID given.
 * @param {string} supabase - The supabase id
 * @returns {Promise&lt;User | null&gt;} A promise that resolves to the user object if found, or null if not found.
 * @throws {Error} If the database find operation fails.
 */
export async function getUserFromSupabaseId(supabaseId: string): Promise<User | null> {
	const db = getDB();
	const users = db.collection<User>('users');

	try {
		const user = await users.findOne({ supabase: supabaseId });
		return serializeMongoDocument(user) as User;
	} catch (err) {
		// Should be expecting every supabase users have mongodb user?
		console.error('Failed to find user:', err);
		throw new Error('Database find failed');
	}
}

/**
 * Converts a User object to a SafeUser object by removing the 'supabase' property.
 * @param {User} user - The user object to convert.
 * @returns {SafeUser} A SafeUser object without the 'supabase' property.
 */
export function toSafeUser(user: User): SafeUser {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { supabase, ...safeUser } = user;
	return safeUser;
}

/**
 * Converts an array of User objects to an array of SafeUser objects.
 * @param {User[]} users - The array of user objects to convert.
 * @returns {SafeUser[]} An array of SafeUser objects without the 'supabase' property.
 */
export function toSafeUsers(users: User[]): SafeUser[] {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return users.map(({ supabase, ...safeUser }) => safeUser);
}
