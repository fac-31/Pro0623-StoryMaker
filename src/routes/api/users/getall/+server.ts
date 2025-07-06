import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getAllUsers } from '$lib/server/userService';

export async function GET(event: RequestEvent) {
	try {
		// Then create a mongodb user with inserted supabase id
		return json(await getAllUsers());
	} catch (e) {
		console.error('Get users failed:', e);
		return json({ error: 'Failed to get user' }, { status: 500 });
	}
}
