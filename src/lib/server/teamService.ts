import { ObjectId } from 'mongodb';
import type { InsertOneResult } from 'mongodb';

import { getDB } from './db';

import type { Team, NewTeam, TeamUser, TeamRole } from '$lib/models/team.model';
import type { User } from '$lib/models/user.model';

export async function insertTeam(name: string, owner: User): Promise<InsertOneResult> {
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
		return await teams.insertOne(team);
	} catch (err) {
		console.error('Failed to insert user:', err);
		throw new Error('Database insert failed');
	}
}

export async function getTeamById(id: string): Promise<Team | null> {
	const db = getDB();
	const teams = db.collection<NewTeam>('teams');

	try {
		return await teams.findOne({ _id: new ObjectId(id) });
	} catch (err) {
		console.error('Failed to get team:', err);
		throw new Error('Database get failed');
	}
}

export async function addUserToTeam(
	team_id: string,
	user_id: string,
	role: TeamRole
): Promise<void> {
	const db = getDB();
	const teams = db.collection<NewTeam>('teams');

	try {
		const teamuser: TeamUser = {
			user: new ObjectId(user_id),
			role: role
		};

		await teams.updateOne({ _id: new ObjectId(team_id) }, { $addToSet: teamuser });
	} catch (err) {
		console.error('Failed to get team:', err);
		throw new Error('Database get failed');
	}
}
