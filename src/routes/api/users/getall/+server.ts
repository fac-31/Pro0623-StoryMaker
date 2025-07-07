import { json } from '@sveltejs/kit';
import { getAllUsers, toSafeUsers } from '$lib/server/userService';

export async function GET() {
	try {
		return json(toSafeUsers(await getAllUsers()));
	} catch (e) {
		console.error('Get users failed:', e);
		return json({ error: 'Failed to get user' }, { status: 500 });
	}
}
