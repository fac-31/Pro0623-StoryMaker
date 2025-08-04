/**
 * @file Handles the deletion of a slide from an existing storyboard.
 */
import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';
import { getUserFromEvent } from '$lib/server/userService';
import type { Storyboard } from '$lib/models/storyboard.model';

interface DeleteSlideRequest {
	storyboard_id: string;
	slideIndex: number;
}

/**
 * @description Deletes a slide at a specified index in a storyboard.
 * @param {RequestEvent} event - The SvelteKit request event.
 * @returns {Promise<Response>} A JSON response containing the updated storyboard or an error.
 */
export const POST: RequestHandler = async (event) => {
	const { storyboard_id, slideIndex } = (await event.request.json()) as DeleteSlideRequest;

	if (!storyboard_id || slideIndex === undefined) {
		return json({ error: 'Missing storyboard_id or slideIndex' }, { status: 400 });
	}

	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const db = await initDB();

	try {
		// Get the current storyboard
		const storyboard = (await db
			.collection('storyboards')
			.findOne({ _id: new ObjectId(storyboard_id) })) as Storyboard | null;

		if (!storyboard) {
			return json({ error: 'Storyboard not found' }, { status: 404 });
		}

		// Check if user has permission to modify this storyboard
		const userProjects = user.projects as string[];
		const userTeams = await db.collection('teams').find({ 'users.user': user._id }).toArray();

		const teamProjects = userTeams.flatMap((team) => team.projects as string[]);
		const allAccessibleProjects = [...userProjects, ...teamProjects];

		if (!allAccessibleProjects.includes(storyboard_id)) {
			return json({ error: 'Permission denied' }, { status: 403 });
		}

		// Validate slide index
		if (slideIndex < 0 || slideIndex >= storyboard.storyOutline.slideOutlines.length) {
			return json({ error: 'Invalid slide index' }, { status: 400 });
		}

		// Prevent deleting the last slide (must have at least 1 slide)
		if (storyboard.storyOutline.slideOutlines.length <= 1) {
			return json(
				{ error: 'Cannot delete the last slide. Storyboard must have at least one slide.' },
				{ status: 400 }
			);
		}

		// Remove the slide from slideOutlines
		const updatedSlideOutlines = [...storyboard.storyOutline.slideOutlines];
		updatedSlideOutlines.splice(slideIndex, 1);

		// Reorder slideIds to be sequential starting from 1
		updatedSlideOutlines.forEach((slide, index) => {
			slide.slideId = index + 1;
		});

		// Remove the corresponding visual slide
		const updatedVisualSlides = [...storyboard.visualSlides];
		updatedVisualSlides.splice(slideIndex, 1);

		// Reorder visual slide numbers to be sequential starting from 1
		updatedVisualSlides.forEach((slide, index) => {
			slide.slideNumber = index + 1;
		});

		// Update the storyboard in the database
		const updateResult = await db.collection('storyboards').updateOne(
			{ _id: new ObjectId(storyboard_id) },
			{
				$set: {
					'storyOutline.slideOutlines': updatedSlideOutlines,
					visualSlides: updatedVisualSlides,
					updatedAt: new Date()
				},
				$unset: {
					gameHtml: '',
					interactions: ''
				}
			}
		);

		if (updateResult.matchedCount === 0) {
			return json({ error: 'Failed to update storyboard' }, { status: 500 });
		}

		// Fetch the updated storyboard to return
		const updatedStoryboard = (await db
			.collection('storyboards')
			.findOne({ _id: new ObjectId(storyboard_id) })) as Storyboard;

		return json({
			success: true,
			message: 'Slide deleted successfully',
			storyboard: updatedStoryboard
		});
	} catch (err) {
		console.error('Failed to delete slide:', err);
		return json({ error: 'Database operation failed' }, { status: 500 });
	}
};
