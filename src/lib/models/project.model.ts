import type { ObjectId } from 'mongodb';

export interface UserPrompt {
	numSlides: number;
	concept: string;
	storyStyle: string;
	targetAudience: string;
	genre: string;
}

export interface Character {
	name: string;
	role: 'protagonist' | 'antagonist' | 'mentor' | 'supporting' | 'narrator';
	description: string;
	emotions: string[];
	position: 'left' | 'center' | 'right' | 'background' | 'foreground';
}

export interface SlideDialogue {
	character: string;
	line: string;
}

export interface SlideText {
	dialogue: SlideDialogue[];
}

// TODO rename VisualSlide to Slide
export interface VisualSlide {
	slideNumber: number;
	
	timestamp: string;
	durationSeconds: number;
	sceneTitle: string;
	text: SlideText;
	characters: Character[];
	sceneDescription: string;
	visualStyle: string;
	cameraAngle: string;

	imageGenerated: boolean;
	imagePrompt?: string;
	imageUrl?: string;
}

export interface Project {
	_id: ObjectId;
	prompts: UserPrompt;
	visualSlides: VisualSlide[];
	currentSlide: number;
	totalSlide: number;
	createdAt: Date;
	updatedAt: Date;
}

export type NewProject = Omit<Project, '_id'>;