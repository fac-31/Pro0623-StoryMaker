import type { ObjectId } from 'mongodb';

import type { UserPrompt } from '$lib/models/UserPrompt';
import type { StoryOutline, VisualSlide } from '$lib/models/story';

export type StoryboardStatus =
	| 'none'
	| 'generating-outline'
	| 'generating-image'
	| 'uploading-image'
	| 'done';

export interface Storyboard {
	_id: ObjectId | string;
	status: StoryboardStatus;
	prompts: UserPrompt;
	currentSlide: number;
	createdAt: Date;
	updatedAt: Date;
	storyOutline: StoryOutline;
	visualSlides: VisualSlide[];
}

export interface NewStoryboard {
	status: StoryboardStatus;
	prompts: UserPrompt;
	currentSlide: number;
	createdAt: Date;
	updatedAt: Date;
	storyOutline: StoryOutline;
	visualSlides: VisualSlide[];
	interactions?: unknown; // Use unknown instead of any
	gameHtml?: string; // Use string for HTML
}
