import type { ObjectId } from 'mongodb';

export type TeamRole = 'user' | 'admin';

interface TeamUser {
	user: ObjectId;
	role: TeamRole;
}

export interface Team {
	_id: ObjectId;
	name: string;
	users: TeamUser[];
	projects: ObjectId[];
}
