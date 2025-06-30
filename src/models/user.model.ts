import type { ObjectId } from 'mongodb';

export interface User {
	_id: ObjectId;
	name: string;
	projects: ObjectId[];
}

export type NewUser = Omit<User, '_id'>;
