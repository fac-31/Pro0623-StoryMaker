/**
 * @file Handles the deletion of a slide from an existing storyboard.
 */
import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { Storyboard } from '$lib/models/storyboard.model';

/**
 * @description Deletes a slide at a specified index in a storyboard.
 * @param {RequestEvent} event - The SvelteKit request event.
 * @returns {Promise<Response>} A JSON response containing the updated storyboard or an error.
 */
export async function POST({ request }) {
	const { storyboard_id, slideIndex } = await request.json();

	if (!storyboard_id || slideIndex === undefined) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const db = await getDB();
	const storyboard = (await db
		.collection('storyboards')
		.findOne({ _id: new ObjectId(storyboard_id) })) as Storyboard | null;

	if (!storyboard) {
		return json({ error: 'Storyboard not found' }, { status: 404 });
	}

	// Remove the slide
	storyboard.storyOutline.slideOutlines.splice(slideIndex, 1);
	storyboard.visualSlides.splice(slideIndex, 1);

	// Re-index subsequent slides
	for (let i = slideIndex; i < storyboard.storyOutline.slideOutlines.length; i++) {
		storyboard.storyOutline.slideOutlines[i].slideId = i + 1;
		storyboard.visualSlides[i].slideNumber = i + 1;
	}

	await db
		.collection('storyboards')
		.updateOne({ _id: new ObjectId(storyboard_id) }, { $set: storyboard });

	return json({ success: true, storyboard });
}
