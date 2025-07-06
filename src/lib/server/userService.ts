import type { InsertOneResult } from 'mongodb';
import type { RequestEvent } from '@sveltejs/kit';

import { getDB } from './db';

import type { User, NewUser, SafeUser } from '$lib/models/user.model';

export async function insertUser(supabase: string, name: string): Promise<InsertOneResult> {
	const db = getDB();
	const users = db.collection<NewUser>('users');

	try {
		const user: NewUser = {
			supabase: supabase,
			name: name,
			projects: []
		};

		return await users.insertOne(user);
	} catch (err) {
		console.error('Failed to insert user:', err);
		throw new Error('Database insert failed');
	}
}

export async function getAllUsers(): Promise<User[]> {
	const db = getDB();
	const users = db.collection<User>('users');

	try {
		return await users.find({}).toArray();
	} catch (err) {
		// Should be expecting every supabase users have mongodb user?
		console.error('Failed to get all users:', err);
		throw new Error('Database find failed');
	}
}

export async function getUserFromEvent(event: RequestEvent): Promise<User | null> {
	const supabase = event.locals.user;
	if (!supabase) return null;

	const db = getDB();
	const users = db.collection<User>('users');

	try {
		return await users.findOne({ supabase: supabase.id });
	} catch (err) {
		// Should be expecting every supabase users have mongodb user?
		console.error('Failed to find user:', err);
		throw new Error('Database find failed');
	}
}

export function toSafeUser(user: User): SafeUser {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { supabase, ...safeUser } = user;
	return safeUser;
}

export function toSafeUsers(users: User[]): SafeUser[] {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return users.map(({ supabase, ...safeUser }) => safeUser);
}
