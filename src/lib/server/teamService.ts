import { ObjectId } from 'mongodb';
import type { InsertOneResult } from 'mongodb';
import { serializeMongoDocument } from '$lib/server/utils.js';
import { getDB, getDBAndClient } from './db';
import type { Team, NewTeam, TeamUser, TeamRole } from '$lib/models/team.model';
import type { User } from '$lib/models/user.model';

/**
 * Inserts a new team into the database and adds it to the owner's teams.
 * @param {string} name - The name of the team.
 * @param {User} owner - The user who is creating the team.
 * @returns {Promise<InsertOneResult>} A promise that resolves to the result of the insert operation.
 * @throws {Error} If the transaction fails.
 */
export async function insertTeam(name: string, owner: User): Promise<InsertOneResult> {
	const { db, client } = getDBAndClient();
	const teamsCollection = db.collection<NewTeam>('teams');
	const usersCollection = db.collection<User>('users');

	const session = client.startSession();
	let insertResult: InsertOneResult | null = null;

	//session is used to ensure atomicity. when we create a team, we also add the team to the user's teams array
	try {
		await session.withTransaction(async () => {
			const teamuser: TeamUser = {
				user: owner._id,
				role: 'admin'
			};

			const team: NewTeam = {
				name,
				users: [teamuser],
				projects: []
			};

			// Insert team
			insertResult = await teamsCollection.insertOne(team, { session });

			// Update user
			const updateResult = await usersCollection.updateOne(
				{ _id: owner._id },
				{ $addToSet: { teams: insertResult.insertedId } },
				{ session }
			);

			// Ensure update was successful, else abort
			if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
				throw new Error('Failed to update user with team ID');
			}
		});

		if (!insertResult) {
			throw new Error('Transaction failed, insertResult missing');
		}

		return insertResult;
	} catch (err) {
		console.error('Transaction failed:', err);
		throw new Error('Transaction failed');
	} finally {
		await session.endSession();
	}
}

/**
 * Retrieves all teams from the database.
 * @returns {Promise<Team[]>} A promise that resolves to an array of all teams.
 * @throws {Error} If the database find operation fails.
 */
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

/**
 * Retrieves all teams associated with a specific user.
 * @param {string} supabaseUserId - The Supabase ID of the user.
 * @returns {Promise<Team[]>} A promise that resolves to an array of teams the user belongs to.
 * @throws {Error} If the database find operation fails.
 */
export async function getTeamsOfUser(supabaseUserId: string): Promise<Team[]> {
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

		const teamsCollection = db.collection('teams');

		const teams = await teamsCollection
			.find({ _id: { $in: user.teams.map((id) => new ObjectId(id)) } })
			.toArray();

		const serialized = serializeMongoDocument(teams);
		return serialized as Team[];
	} catch (err) {
		console.error('Failed to get all teams:', err);
		throw new Error('Database find failed');
	}
}

/**
 * Retrieves a team by its ID.
 * @param {string} id - The ID of the team to retrieve.
 * @returns {Promise<Team | null>} A promise that resolves to the team object or null if not found.
 * @throws {Error} If the database get operation fails.
 */
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

/**
 * Updates a user's role within a team or adds the user to the team if not already a member.
 * @param {string} team_id - The ID of the team.
 * @param {string} user_id - The ID of the user.
 * @param {TeamRole} role - The new role for the user.
 * @returns {Promise<void>}
 * @throws {Error} If the database update operation fails.
 */
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

/**
 * Removes a user from a team.
 * @param {string} team_id - The ID of the team.
 * @param {string} user_id - The ID of the user to remove.
 * @returns {Promise<void>}
 * @throws {Error} If the database update operation fails.
 */
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

/**
 * Checks if a user has permission to edit a team.
 * @param {string} team_id - The ID of the team.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<true | string>} Returns true if the user can edit, or an error message if not.
 */
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