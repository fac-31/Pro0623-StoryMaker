import type { ObjectId } from 'mongodb';

import type { UserPrompt } from '$lib/models/UserPrompt';
import type { StoryOutline } from '$lib/models/story';
import type { VisualSlide } from '$lib/models/story';

export type StoryboardStatus = 'none' | 'generating-outline' | 'generating-image' | 'uploading-image' | 'done';

export interface Storyboard {
	_id: ObjectId;
	status: StoryboardStatus;
	prompts: UserPrompt;
	currentSlide: number;
	createdAt: Date;
	updatedAt: Date;
	storyOutline: StoryOutline;
	visualSlides: VisualSlide[];
}

export type NewStoryboard = Omit<Storyboard, '_id'>;
