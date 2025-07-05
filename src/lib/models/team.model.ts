import type { ObjectId } from 'mongodb';

export type TeamRole = 'user' | 'admin';

export interface TeamUser {
	user: ObjectId;
	role: TeamRole;
}

export interface Team {
	_id: ObjectId;
	name: string;
	users: TeamUser[];
	projects: ObjectId[];
}

export type NewTeam = Omit<Team, '_id'>;
