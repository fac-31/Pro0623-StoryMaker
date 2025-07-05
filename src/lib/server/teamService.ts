import { getDB } from './db';

import type { NewTeam, TeamUser } from '$lib/models/team.model';
import type { User } from '$lib/models/user.model';

export async function insertTeam(name: string, owner: User): Promise<void> {
	const db = getDB();
	const teams = db.collection<NewTeam>('teams');

	const teamuser: TeamUser = {
		user: owner._id,
		role: 'admin'
	};

	const team: NewTeam = {
		name: name,
		users: [teamuser],
		projects: []
	};

	try {
		await teams.insertOne(team);
	} catch (err) {
		console.error('Failed to insert user:', err);
		throw new Error('Database insert failed');
	}
}
