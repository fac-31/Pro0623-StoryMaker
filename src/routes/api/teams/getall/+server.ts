import { json } from '@sveltejs/kit';
import { getAllTeams } from '$lib/server/teamService';

/**
 * Handles GET requests to retrieve all teams.
 * 
 * This function attempts to fetch all teams using the getAllTeams service.
 * If successful, it returns the teams as a JSON response.
 * If an error occurs, it logs the error and returns a 500 status code with an error message.
 * 
 * @async
 * @returns {Promise<Response>} A promise that resolves to a Response object.
 *                              On success, the response contains a JSON array of all teams.
 *                              On failure, the response contains a JSON object with an error message and a 500 status code.
 * @throws {Error} If there's an issue with the getAllTeams service or JSON serialization.
 */
export async function GET() {
    try {
        return json(await getAllTeams());
    } catch (e) {
        console.error('Get teams failed:', e);
        return json({ error: 'Failed to get teams' }, { status: 500 });
    }
}
