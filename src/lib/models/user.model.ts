import type { ObjectId } from 'mongodb';

export interface User {
	_id: ObjectId;
	supabase: string;
	name: string;
	projects: ObjectId[];
	teams: ObjectId[];
}

export type NewUser = Omit<User, '_id'>;

export type SafeUser = Omit<User, 'supabase'>;

export interface UserSignup {
	email: string;
	password: string;
	full_name: string;
	display_name: string;
}
