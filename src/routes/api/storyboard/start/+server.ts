import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import type { NewStoryboard } from '$lib/models/storyboard.model';
import { getUserFromEvent } from '$lib/server/userService';

export const POST: RequestHandler = async (event) => {
	const prompts: UserPrompt = await event.request.json();

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
