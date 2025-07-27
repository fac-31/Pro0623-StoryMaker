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
	mode: 'create' | 'edit';
	status: StoryboardStatus;
	prompts: UserPrompt;
	currentSlide: number;
	createdAt: Date;
	updatedAt: Date;
	storyOutline: StoryOutline;
	visualSlides: VisualSlide[];
	characterSheet: string;
	userWantsEdit: boolean;
	editHistory?: Record<number, {
	original: string;
	instruction: string;
	updated: string;
	}[]>;
	userAction: 'approve' | 'reprompt';
}

export interface NewStoryboard {
	mode: 'create' | 'edit';
	status: StoryboardStatus;
	prompts: UserPrompt;
	currentSlide: number;
	createdAt: Date;
	updatedAt: Date;
	storyOutline: StoryOutline;
	visualSlides: VisualSlide[];
	characterSheet: string;
	interactions?: unknown; // Use unknown instead of any
	gameHtml?: string; // Use string for HTML
	userWantsEdit: boolean;
		editHistory?: Record<number, {
		original: string;
		instruction: string;
		updated: string;
	}[]>;
	userAction: 'approve' | 'reprompt';
}
