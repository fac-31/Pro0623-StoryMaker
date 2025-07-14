import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUserFromEvent, toSafeUser } from '$lib/server/userService';

/**
 * Handles GET requests to retrieve the current user's information.
 *
 * @param event - The RequestEvent object containing information about the incoming request.
 * @returns A JSON response containing the user's safe information if authenticated,
 *          or an error message with appropriate status code if not authenticated or if an error occurs.
 */
export async function GET(event: RequestEvent) {
	try {
		const user = await getUserFromEvent(event);
		if (!user) return json({ error: 'User not logged in' }, { status: 401 });

		return json(toSafeUser(user));
	} catch (e) {
		console.error('Get users failed:', e);
		return json({ error: 'Failed to get user' }, { status: 500 });
	}
}
