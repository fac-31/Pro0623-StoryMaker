import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

import { teamRoles } from '$lib/models/team.model';
import { getUserFromEvent } from '$lib/server/userService';
import { canUserEditTeam, updateTeamUser } from '$lib/server/teamService';

/**
 * Handles POST requests to update a user's role within a team.
 * 
 * This function performs the following steps:
 * 1. Extracts request information
 * 2. Authenticates the user
 * 3. Checks if the user has permission to edit the team
 * 4. Validates the new role
 * 5. Updates the user's role in the team
 * 
 * @param event - The RequestEvent object containing information about the HTTP request
 * @returns A JSON response indicating success or failure
 *   - On success: { success: true }
 *   - On failure: { error: string } with an appropriate HTTP status code
 * @throws Will return a JSON error response if any step fails
 */
export async function POST(event: RequestEvent) {
    const info = await event.request.json();

    const user = await getUserFromEvent(event);
    if (!user) return json({ error: 'User not logged in' }, { status: 401 });

    try {
        const result = await canUserEditTeam(info.team_id, user._id.toString());
        if (result !== true) return json({ error: result }, { status: 401 });

        if (!teamRoles.includes(info.role))
            return json({ error: 'Invalid role ' + info.role }, { status: 401 });

        await updateTeamUser(info.team_id, info.user_id, info.role);
        return json({ success: true });
    } catch (e) {
        console.error('Insert team failed:', e);
        return json({ error: 'Failed to insert team' }, { status: 500 });
    }
}
