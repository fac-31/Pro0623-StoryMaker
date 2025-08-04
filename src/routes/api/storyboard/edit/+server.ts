import { ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { Storyboard } from '$lib/models/storyboard.model';
import { getUserFromEvent } from '$lib/server/userService';
import type { SlideOutline } from '$lib/models/story.ts';

export const POST: RequestHandler = async (event) => {
	const { newSlideOutline, slideNumber, storyboard_id } = (await event.request.json()) as {
		newSlideOutline: SlideOutline;
		slideNumber: number;
		storyboard_id: string;
	};

	console.log('[Edit] the new slide outline is ');
	console.log(newSlideOutline);
	console.log(`[Edit] slide Number ${slideNumber}`);
	console.log(`[Edit] storyboard_id ${storyboard_id}`);

	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const db = await initDB();
	const storyboard = (await db
		.collection('storyboards')
		.findOne({ _id: new ObjectId(storyboard_id) })) as Storyboard;
	if (!storyboard) return json({ error: 'Storyboard not found' }, { status: 404 });

	try {
		const result = await db.collection('storyboards').updateOne(
			{ _id: new ObjectId(storyboard_id) },
			{
				$set: {
					[`storyOutline.slideOutlines.${slideNumber - 1}`]: newSlideOutline,
					currentSlide: slideNumber,
					updatedAt: new Date()
				},
				$unset: {
					gameHtml: '',
					interactions: ''
				}
			}
		);

		if (result.matchedCount === 0) {
			return json({ error: 'Storyboard not found' }, { status: 404 });
		}

		return json({ success: true, id: storyboard_id, modifiedCount: result.modifiedCount });
	} catch (err) {
		console.error('Failed to update storyboard:', err);
		return json({ error: 'Database update failed' }, { status: 500 });
	}
};
