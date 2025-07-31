import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import type { RunnableConfig } from '@langchain/core/runnables';
import { addLog } from '$lib/server/storyboardLogStore';
import type { Storyboard } from '$lib/models/storyboard.model';
import type { StoryOutline, VisualSlide } from '$lib/models/story';
import { storyOutlineSchema } from '$lib/schemas/story.schema.js';
import { updateStream } from '$lib/streams';

const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0
}).withStructuredOutput(storyOutlineSchema);

/**
 * Generates a story outline based on the given storyboard state.
 * @param {Storyboard} state - The current state of the storyboard.
 * @returns {Promise<Partial<Storyboard>>} A promise that resolves to a partial storyboard with the generated outline.
 */
export const generateStoryOutline = async (
	state: Storyboard,
	config: RunnableConfig
): Promise<Partial<Storyboard>> => {
	addLog(`[LangGraph] generateStoryOutline called with: ${state.prompts}`);

	state.status = 'generating-outline';
	updateStream(state._id.toString(), state);

	const prompt = ChatPromptTemplate.fromTemplate(`
Create a detailed storyboard structure for: {concept}

Requirements:
- Create exactly {numSlides} slides
- Include specific character descriptions for visual generation
- Provide clear narration and/or dialogue for each slide
- Describe the visual scene in detail for image generation
- Specify camera angles and visual style
- Ensure story flows logically from slide to slide
- Calculate accurate timestamps for each slide

Target audience: {targetAudience}
Story style: {storyStyle}
Genre: {genre}
`);

	const chain = prompt.pipe(llm);

	type ChainInput = Parameters<typeof chain.invoke>[0];
	const storyOutLine = (await chain.invoke(state.prompts as ChainInput, config)) as StoryOutline;

	// Initialize visual slides structure
	const slides: VisualSlide[] = storyOutLine.slideOutlines.map((part, index) => ({
		slideNumber: index + 1,
		imageGenerated: false
	}));

	addLog(`[LangGraph] generateStoryOutline result: ${JSON.stringify(storyOutLine, null, 2)}`);
	return {
		storyOutline: storyOutLine,
		currentSlide: 1,
		visualSlides: slides
	};
};
