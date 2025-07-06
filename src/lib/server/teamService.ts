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

export async function getAllTeams(): Promise<Team[]> {
	const db = getDB();
	const teams = db.collection<Team>('teams');

	try {
		return await teams.find({}).toArray();
	} catch (err) {
		console.error('Failed to get all teams:', err);
		throw new Error('Database find failed');
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

export async function updateTeamUser(
	team_id: string,
	user_id: string,
	role: TeamRole
): Promise<void> {
	const db = getDB();
	const teams = db.collection<Team>('teams');

	try {
		const team = await teams.findOne({ _id: new ObjectId(team_id) });
		if (!team) throw new Error('Team not found');

		const existingUser = team.users.find((u) => u.user.equals(user_id));

		if (existingUser) {
			// User exists, update role
			existingUser.role = role;
		} else {
			// User dont exist, add a new one
			const teamuser: TeamUser = {
				user: new ObjectId(user_id),
				role: role
			};

			team.users.push(teamuser);
		}

		await teams.updateOne({ _id: new ObjectId(team_id) }, { $set: { users: team.users } });
	} catch (err) {
		console.error('Failed to update team user:', err);
		throw new Error('Database update failed');
	}
}

export async function removeTeamUser(team_id: string, user_id: string): Promise<void> {
	const db = getDB();
	const teams = db.collection<Team>('teams');

	try {
		await teams.updateOne(
			{ _id: new ObjectId(team_id) },
			{
				$pull: {
					users: { user: new ObjectId(user_id) }
				}
			}
		);
	} catch (err) {
		console.error('Failed to update team user:', err);
		throw new Error('Database update failed');
	}
}

export async function canUserEditTeam(team_id: string, user_id: string) {
	const team = await getTeamById(team_id);
	if (!team) return 'Could not find team by id ' + team_id;

	const teamUser: TeamUser | undefined = team.users.find((teamUser) =>
		teamUser.user.equals(user_id)
	);

	if (!teamUser) return 'You are not in this team to edit';

	if (teamUser.role !== 'admin') return 'You are not an admin to edit this team';

	return true;
}
