import { getDB } from './db';

import type { NewUser } from '$lib/models/user.model';

export async function insertUser(supabase: string, name: string): Promise<void> {
	const db = getDB();
	const users = db.collection<NewUser>('users');

	try {
		const user: NewUser = {
			supabase: supabase,
			name: name,
			projects: []
		};

		await users.insertOne(user);
	} catch (err) {
		console.error('Failed to insert user:', err);
		throw new Error('Database insert failed');
	}
}
