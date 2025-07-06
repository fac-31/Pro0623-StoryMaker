import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUserFromEvent, toSafeUser } from '$lib/server/userService';

export async function GET(event: RequestEvent) {
	try {
		const user = await getUserFromEvent(event);
		if (!user)
			return json({ error: 'User not logged in' }, { status: 401 });

		return json(toSafeUser(user));
	} catch (e) {
		console.error('Get users failed:', e);
		return json({ error: 'Failed to get user' }, { status: 500 });
	}
}
