export interface Character {
	name: string;
	role: 'protagonist' | 'antagonist' | 'mentor' | 'supporting' | 'narrator';
	description: string;
	emotions: string[];
	position: 'left' | 'center' | 'right' | 'background' | 'foreground';
}

export interface SlideText {
	dialogue: Array<{
		character: string;
		line: string;
	}>;
}

export interface SlideOutline {
	slideId: number;
	timestamp: string;
	durationSeconds: number;
	sceneTitle: string;
	text: SlideText;
	characters: Character[];
	sceneDescription: string;
	visualStyle: string;
	cameraAngle: string;
}

export interface StoryMetadata {
	title: string;
	totalDuration: string;
	genre: string;
	style: string;
	targetAudience: string;
}

export interface StoryOutline {
	storyMetadata: StoryMetadata;
	slideOutlines: SlideOutline[];
}

export interface VisualSlide {
	slideNumber: number;
	imageGenerated: boolean;
	imagePrompt?: string;
	imageUrl?: string;
}
