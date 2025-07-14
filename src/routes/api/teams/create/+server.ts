import type { InsertOneResult } from 'mongodb';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUserFromEvent } from '$lib/server/userService';
import { insertTeam } from '$lib/server/teamService';

/**
 * Handles POST requests to create a new team.
 * 
 * This function processes the request to create a new team, verifies user authentication,
 * and attempts to insert the team into the database.
 * 
 * @param event - The RequestEvent object containing the request details.
 * @returns A JSON response indicating the success or failure of the team creation.
 *          If successful, returns an object with 'success' and 'insertedId' properties.
 *          If unsuccessful, returns an error object with appropriate status code.
 */
export async function POST(event: RequestEvent) {
    const info = await event.request.json();

    const user = await getUserFromEvent(event);
    if (!user) return json({ error: 'User not logged in' }, { status: 401 });

    try {
        const result: InsertOneResult = await insertTeam(info.name, user);
        return json({
            success: result.acknowledged,
            insertedId: result.insertedId
        });
    } catch (e) {
        console.error('Insert team failed:', e);
        return json({ error: 'Failed to insert team' }, { status: 500 });
    }
}
