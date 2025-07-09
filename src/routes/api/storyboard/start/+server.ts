import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import type { NewStoryboard } from '$lib/models/storyboard.model';

export const POST: RequestHandler = async ({ request }) => {
	const prompts: UserPrompt = await request.json();

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

	return json(result);
};
