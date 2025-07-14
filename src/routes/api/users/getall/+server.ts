import { json } from '@sveltejs/kit';
import { getAllUsers, toSafeUsers } from '$lib/server/userService';

/**
 * Handles GET requests to retrieve all users.
 * 
 * This function attempts to fetch all users from the database,
 * converts them to a safe format, and returns them as a JSON response.
 * If an error occurs during the process, it logs the error and
 * returns a JSON error response with a 500 status code.
 * 
 * @async
 * @returns {Promise<Response>} A promise that resolves to a Response object
 *                              containing either the user data as JSON or
 *                              an error message with a 500 status code.
 * @throws {Error} If there's an issue fetching or processing user data.
 */
export async function GET() {
    try {
        return json(toSafeUsers(await getAllUsers()));
    } catch (e) {
        console.error('Get users failed:', e);
        return json({ error: 'Failed to get user' }, { status: 500 });
    }
}
