import { StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import OpenAI from 'openai';
import { addLog } from '$lib/server/storyboardLogStore';

// Types and Interfaces
interface SlideContent {
	scene: string;
	characters: string;
	action: string;
	dialogue: string;
	imagePrompt?: string;
	imageUrl?: string;
}

interface Slide {
	slideNumber: number;
	title: string;
	storyOutline: string;
	content: SlideContent | null;
	imageGenerated: boolean;
}

interface HeroJourneyPart {
	title: string;
	description: string;
	beats: string[];
}

interface HeroJourney {
	parts: HeroJourneyPart[];
}

interface StoryboardState {
	userConcept: string;
	heroJourneyOutline: HeroJourney;
	currentSlide: number | null;
	slides: Slide[];
	currentSlideDraft: SlideContent | null;
	refinementFeedback: string | null;
	generationReady: boolean;
	generatedImages: string[];
}

// Initialize LLM and OpenAI client
const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0.7
});

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// Node Functions
const conceptToHeroJourney = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] conceptToHeroJourney called with:', state.userConcept);
	addLog(`[LangGraph] conceptToHeroJourney called with: ${state.userConcept}`);
	const prompt = ChatPromptTemplate.fromTemplate(`
    Transform this concept into a 6-part hero's journey story structure:
    Concept: {concept}
    
    Create exactly 6 parts following this structure:
    1. Ordinary World - The hero's normal life
    2. Call to Adventure - The inciting incident
    3. Crossing the Threshold - Entering the adventure
    4. Tests and Trials - Challenges faced
    5. Ordeal - The major crisis/climax
    6. Return Transformed - Resolution and return
    
    For each part, provide:
    - title: string
    - description: string (2-3 sentences)
    - beats: string[] (key story beats)
    
    Return as valid JSON with this exact structure:
    {{
      "parts": [
        {{"title": "...", "description": "...", "beats": ["...", "..."]}},
        // ... 5 more parts
      ]
    }}
  `);

	const chain = prompt.pipe(llm);
	const response = await chain.invoke({ concept: state.userConcept });

	let heroJourney: HeroJourney;
	try {
		heroJourney = JSON.parse(response.content as string);
	} catch {
		// Fallback structure if JSON parsing fails
		heroJourney = {
			parts: Array.from({ length: 6 }, (_, i) => ({
				title: `Part ${i + 1}`,
				description: 'Story part description',
				beats: ['Story beat']
			}))
		};
	}

	// Initialize slides structure
	const slides: Slide[] = heroJourney.parts.map((part, index) => ({
		slideNumber: index + 1,
		title: part.title,
		storyOutline: part.description,
		content: null,
		imageGenerated: false
	}));

	console.log('[LangGraph] conceptToHeroJourney result:', { heroJourney, slides });
	addLog(`[LangGraph] conceptToHeroJourney result: ${JSON.stringify({ heroJourney, slides })}`);
	return {
		heroJourneyOutline: heroJourney,
		slides,
		currentSlide: 1
	};
};

const generateSlideDraft = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] generateSlideDraft called for slide:', state.currentSlide);
	addLog(`[LangGraph] generateSlideDraft called for slide: ${state.currentSlide}`);
	if (!state.currentSlide) return {};

	const slideInfo = state.slides[state.currentSlide - 1];

	const prompt = ChatPromptTemplate.fromTemplate(`
    Create a detailed first draft for slide {slideNumber} of a storyboard.
    
    Story Context: {userConcept}
    Overall Journey: {heroJourney}
    Current Slide: {slideTitle}
    Slide Outline: {slideOutline}
    
    Generate a cinematic and visual description with:
    1. SCENE: Detailed description of setting, mood, lighting, environment
    2. CHARACTERS: Who is present, appearance, emotions, positioning
    3. ACTION: What is happening, movement, key visual elements
    4. DIALOGUE: Any spoken words, thought bubbles, or text overlays
    
    Return as valid JSON:
    {{
      "scene": "...",
      "characters": "...",
      "action": "...",
      "dialogue": "..."
    }}
  `);

	const chain = prompt.pipe(llm);
	const response = await chain.invoke({
		slideNumber: state.currentSlide,
		userConcept: state.userConcept,
		heroJourney: JSON.stringify(state.heroJourneyOutline),
		slideTitle: slideInfo.title,
		slideOutline: slideInfo.storyOutline
	});

	let slideContent: SlideContent;
	try {
		slideContent = JSON.parse(response.content as string);
	} catch {
		slideContent = {
			scene: 'A scene description',
			characters: 'Character descriptions',
			action: 'Action taking place',
			dialogue: 'Dialogue or text'
		};
	}

	console.log('[LangGraph] generateSlideDraft result:', slideContent);
	addLog(`[LangGraph] generateSlideDraft result: ${JSON.stringify(slideContent)}`);
	return {
		currentSlideDraft: slideContent
	};
};

const refineSlideContent = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] refineSlideContent called with feedback:', state.refinementFeedback);
	addLog(`[LangGraph] refineSlideContent called with feedback: ${state.refinementFeedback}`);
	if (!state.refinementFeedback || !state.currentSlideDraft) {
		return {};
	}

	const prompt = ChatPromptTemplate.fromTemplate(`
    Refine this slide content based on the user's feedback:
    
    Current Content:
    Scene: {scene}
    Characters: {characters}
    Action: {action}
    Dialogue: {dialogue}
    
    User Feedback: {feedback}
    
    Improve the content while maintaining the overall story flow.
    Return as valid JSON:
    {{
      "scene": "...",
      "characters": "...",
      "action": "...",
      "dialogue": "..."
    }}
  `);

	const chain = prompt.pipe(llm);
	const response = await chain.invoke({
		...state.currentSlideDraft,
		feedback: state.refinementFeedback
	});

	let refinedContent: SlideContent;
	try {
		refinedContent = JSON.parse(response.content as string);
	} catch {
		refinedContent = state.currentSlideDraft;
	}

	console.log('[LangGraph] refineSlideContent result:', refinedContent);
	addLog(`[LangGraph] refineSlideContent result: ${JSON.stringify(refinedContent)}`);
	return {
		currentSlideDraft: refinedContent,
		refinementFeedback: null
	};
};

const createImagePrompt = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] createImagePrompt called for slide:', state.currentSlide);
	addLog(`[LangGraph] createImagePrompt called for slide: ${state.currentSlide}`);
	if (!state.currentSlideDraft) return {};

	const prompt = ChatPromptTemplate.fromTemplate(`
    Create a detailed image generation prompt for DALL-E based on this storyboard slide:
    
    Scene: {scene}
    Characters: {characters}
    Action: {action}
    Dialogue: {dialogue}
    
    Create a single, detailed prompt that captures the visual essence.
    Focus on:
    - Visual style (cinematic, artistic style)
    - Composition and framing
    - Lighting and mood
    - Character details and positioning
    - Environmental details
    
    Keep it under 400 characters for DALL-E optimization.
    Return ONLY the prompt text, no JSON formatting.
  `);

	const chain = prompt.pipe(llm);
	const { scene, characters, action, dialogue } = state.currentSlideDraft;
	const response = await chain.invoke({ scene, characters, action, dialogue });

	const updatedDraft: SlideContent = {
		...state.currentSlideDraft,
		imagePrompt: (response.content as string).trim()
	};

	console.log('[LangGraph] createImagePrompt result:', updatedDraft.imagePrompt);
	addLog(`[LangGraph] createImagePrompt result: ${updatedDraft.imagePrompt}`);
	return {
		currentSlideDraft: updatedDraft
	};
};

const generateImage = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] generateImage called for prompt:', state.currentSlideDraft?.imagePrompt);
	addLog(`[LangGraph] generateImage called for prompt: ${state.currentSlideDraft?.imagePrompt}`);
	if (!state.currentSlideDraft?.imagePrompt) {
		return { generationReady: false };
	}

	try {
		const response = await openai.images.generate({
			model: 'dall-e-3',
			prompt: state.currentSlideDraft.imagePrompt,
			size: '1792x1024', // Landscape format good for storyboards
			quality: 'standard',
			n: 1
		});

		const imageUrl = response.data && response.data[0] && response.data[0].url;

		const updatedDraft: SlideContent = {
			...state.currentSlideDraft,
			imageUrl
		};

		if (imageUrl) {
			console.log('[LangGraph] generateImage result:', imageUrl);
			addLog(`[LangGraph] generateImage result: ${imageUrl}`);
		} else {
			console.log('[LangGraph] generateImage failed');
			addLog('[LangGraph] generateImage failed');
		}
		return {
			currentSlideDraft: updatedDraft,
			generationReady: true
		};
	} catch (error) {
		addLog('Image generation failed:', error);
		return {
			generationReady: false
		};
	}
};

const saveSlideAndAdvance = async (state: StoryboardState): Promise<Partial<StoryboardState>> => {
	console.log('[LangGraph] saveSlideAndAdvance called for slide:', state.currentSlide);
	addLog(`[LangGraph] saveSlideAndAdvance called for slide: ${state.currentSlide}`);
	if (!state.currentSlide || !state.currentSlideDraft) return {};

	const currentSlideNum = state.currentSlide;
	const slides = [...state.slides];

	// Update the current slide with finalized content
	slides[currentSlideNum - 1] = {
		...slides[currentSlideNum - 1],
		content: state.currentSlideDraft,
		imageGenerated: true
	};

	// Advance to next slide or mark complete
	const nextSlide = currentSlideNum < 6 ? currentSlideNum + 1 : null;

	console.log('[LangGraph] saveSlideAndAdvance nextSlide:', nextSlide);
	addLog(`[LangGraph] saveSlideAndAdvance nextSlide: ${nextSlide}`);
	return {
		slides,
		currentSlide: nextSlide,
		currentSlideDraft: null,
		generationReady: false
	};
};

// Conditional Logic Functions
const shouldRefine = (state: StoryboardState): 'refine' | 'generateImage' => {
	return state.refinementFeedback ? 'refine' : 'generateImage';
};

const shouldContinue = (state: StoryboardState): 'nextSlide' | 'complete' => {
	return state.currentSlide && state.currentSlide <= 6 ? 'nextSlide' : 'complete';
};

// Build the Graph
export const createStoryboardGraph = () => {
	console.log('[LangGraph] createStoryboardGraph called');
	addLog('[LangGraph] createStoryboardGraph called');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const workflow = new StateGraph<StoryboardState, any, any, string>({
		channels: {
			userConcept: null,
			heroJourneyOutline: null,
			currentSlide: null,
			slides: null,
			currentSlideDraft: null,
			refinementFeedback: null,
			generationReady: null,
			generatedImages: null
		}
	});

	// Add nodes
	workflow.addNode('conceptToJourney', conceptToHeroJourney);
	workflow.addNode('generateDraft', generateSlideDraft);
	workflow.addNode('refineContent', refineSlideContent);
	workflow.addNode('createImagePrompt', createImagePrompt);
	workflow.addNode('generateImage', generateImage);
	workflow.addNode('saveAndAdvance', saveSlideAndAdvance);

	// Define edges using '__start__' and '__end__' as required
	workflow.addEdge('__start__', 'conceptToJourney');
	workflow.addEdge('conceptToJourney', 'generateDraft');
	workflow.addConditionalEdges('generateDraft', shouldRefine, {
		refine: 'refineContent',
		generateImage: 'createImagePrompt'
	});
	workflow.addEdge('refineContent', 'createImagePrompt');
	workflow.addEdge('createImagePrompt', 'generateImage');
	workflow.addEdge('generateImage', 'saveAndAdvance');
	workflow.addConditionalEdges('saveAndAdvance', shouldContinue, {
		nextSlide: 'generateDraft',
		complete: '__end__'
	});

	return workflow.compile();
};

// Main execution function
export const runStoryboardCreation = async (userConcept: string): Promise<StoryboardState> => {
	console.log('[LangGraph] runStoryboardCreation called with:', userConcept);
	addLog(`[LangGraph] runStoryboardCreation called with: ${userConcept}`);
	const app = createStoryboardGraph();

	const initialState: StoryboardState = {
		userConcept,
		heroJourneyOutline: { parts: [] },
		currentSlide: 1,
		slides: [],
		currentSlideDraft: null,
		refinementFeedback: null,
		generationReady: false,
		generatedImages: []
	};

	const result = await app.invoke(initialState);
	console.log('[LangGraph] runStoryboardCreation result:', result);
	addLog(`[LangGraph] runStoryboardCreation result: ${JSON.stringify(result)}`);
	return result as StoryboardState;
};

// Interactive Functions for UI Integration
export const getCurrentSlideDraft = (state: StoryboardState): SlideContent | null => {
	return state.currentSlideDraft;
};

export const submitRefinementFeedback = (
	state: StoryboardState,
	feedback: string
): Partial<StoryboardState> => {
	return { refinementFeedback: feedback };
};

export const approveSlideForGeneration = (): Partial<StoryboardState> => {
	return { generationReady: true };
};

// Usage Example
export const exampleUsage = async () => {
	const concept =
		'A young programmer discovers they can enter and manipulate computer programs as virtual worlds';

	try {
		const finalState = await runStoryboardCreation(concept);

		// Print results
		finalState.slides.forEach((slide) => {
			addLog(`\nSlide ${slide.slideNumber}: ${slide.title}`);
			if (slide.content) {
				addLog(`Scene: ${slide.content.scene.substring(0, 100)}...`);
				addLog(`Generated: ${slide.imageGenerated}`);
			}
		});

		return finalState;
	} catch (error) {
		addLog('Storyboard creation failed:', error);
		throw error;
	}
};

// For React/Next.js integration
export interface StoryboardHook {
	state: StoryboardState | null;
	isLoading: boolean;
	error: string | null;
	startStoryboard: (concept: string) => Promise<void>;
	refineCurrentSlide: (feedback: string) => Promise<void>;
	approveCurrentSlide: () => Promise<void>;
	getCurrentSlide: () => Slide | null;
}

// Example React hook structure (you'd implement this with your state management)
export const useStoryboard = (): StoryboardHook => {
	// Implementation would depend on your React setup
	// This is just the interface structure
	throw new Error('Implement this hook based on your React state management preference');
};
