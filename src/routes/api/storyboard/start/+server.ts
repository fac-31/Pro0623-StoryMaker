import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import type { NewStoryboard } from '$lib/models/storyboard.model';
import type { Team } from '$lib/models/team.model';
import { getUserFromEvent } from '$lib/server/userService';

/**
 * Handles POST requests to start a new storyboard.
 *
 * @type {RequestHandler}
 * @async
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
 * @returns {Promise<import('@sveltejs/kit').JSONResponse>} A JSON response with the result of the storyboard creation or an error message.
 *
 * @description
 * This function:
 * 1. Extracts user prompts from the request body.
 * 2. Creates a new storyboard object with initial values.
 * 3. Saves the new storyboard to the database.
 * 4. Updates the user's projects list with the new storyboard ID.
 * 5. Returns the result of the storyboard creation.
 *
 * @throws {import('@sveltejs/kit').JSONResponse}
 * - Returns a 500 status if saving the storyboard fails.
 * - Returns a 404 status if the user is not found.
 */
export const POST: RequestHandler = async (event) => {
	const { prompts, team } = await event.request.json() as {
		prompts: UserPrompt,
		team: Team | null,
	};

	const storyboard: NewStoryboard = {
		status: 'none',
		prompts,
		currentSlide: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		storyOutline: {
			storyMetadata: {
				title: '',
				totalDuration: '',
				genre: '',
				style: '',
				targetAudience: ''
			},
			slideOutlines: []
		},
		visualSlides: []
	};

	const db = await initDB();
	const result = await db.collection('storyboards').insertOne(storyboard);

	if (!result.acknowledged) {
		return json({ error: 'Failed to save storyboard' }, { status: 500 });
	}

	// Update user to include this storyboard
	const user = await getUserFromEvent(event);

	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}
	if (!user.projects) {
		user.projects = [];
	}

	user.projects.push(result.insertedId);

	await db.collection('users').updateOne({ _id: user._id }, { $set: { projects: user.projects } });

	return json(result);
};
