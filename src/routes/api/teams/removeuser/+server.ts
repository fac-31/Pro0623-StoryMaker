import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

import { getUserFromEvent } from '$lib/server/userService';
import { canUserEditTeam, removeTeamUser } from '$lib/server/teamService';

/**
 * Handles the POST request to remove a user from a team.
 *
 * This function authenticates the user, checks if they have permission to edit the team,
 * ensures they're not trying to remove themselves, and then removes the specified user from the team.
 *
 * @param event - The RequestEvent object containing the request details.
 * @returns A JSON response indicating the success or failure of the operation.
 *          - If successful, returns { success: true }.
 *          - If unsuccessful, returns an error message with an appropriate status code.
 * @throws Will throw an error if the team insertion fails.
 */
export async function POST(event: RequestEvent) {
	const info = await event.request.json();

	const user = await getUserFromEvent(event);
	if (!user) return json({ error: 'User not logged in' }, { status: 401 });

	try {
		const result = await canUserEditTeam(info.team_id, user._id.toString());
		if (result !== true) return json({ error: result }, { status: 401 });

		if (user._id.toString() == info.user_id)
			return json({ error: 'You cannot remove yourself from team' }, { status: 401 });

		await removeTeamUser(info.team_id, info.user_id);
		return json({ success: true });
	} catch (e) {
		console.error('Insert team failed:', e);
		return json({ error: 'Failed to insert team' }, { status: 500 });
	}
}
