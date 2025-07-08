import type { ObjectId } from 'mongodb';

import type { UserPrompt } from '$lib/models/UserPrompt';
import type { StoryOutline } from '$lib/models/story';
import type { VisualSlide } from '$lib/models/story';

export interface Storyboard {
	_id: ObjectId;
	prompts: UserPrompt;
	storyOutline?: StoryOutline;
	visualSlides?: VisualSlide[];
	metadata?: {
		// TODO remove this
		totalSlides: number;
		createdAt: Date;
		updatedAt: Date;
		userConcept: UserPrompt;
	};
}

export type NewStoryboard = Omit<Storyboard, '_id'>;
