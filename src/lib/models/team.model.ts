import type { ObjectId } from 'mongodb';

export const teamRoles = ['user', 'admin'] as const;

export type TeamRole = (typeof teamRoles)[number];

export interface TeamUser {
	user: ObjectId | string;
	role: TeamRole;
}

export interface Team {
	_id: ObjectId | string;
	name: string;
	users: TeamUser[];
	projects: ObjectId[] | string[];
}

export type NewTeam = Omit<Team, '_id'>;
