import type { Storyboard } from '$lib/models/storyboard.model';
import { createStoryboardGraph } from './graph';
import { addLog } from '$lib/server/storyboardLogStore';
import { getCurrentPrompt } from './utils/userPrompt';

export const runStoryboardCreation = async (
	storyboard: Storyboard,
	signal: AbortSignal
): Promise<Storyboard> => {
	console.log('[LangGraph] runStoryboardCreation called with:', getCurrentPrompt(storyboard));
	addLog(`[LangGraph] runStoryboardCreation called with: ${getCurrentPrompt(storyboard)}`);
	const app = createStoryboardGraph('create');

	storyboard.currentSlide = 1;

	const result = await app.invoke(storyboard, { signal });
	console.log('[LangGraph] runStoryboardCreation result:', result);
	addLog(`[LangGraph] runStoryboardCreation result: ${JSON.stringify(result)}`);

	result.updatedAt = new Date();
	result.status = 'done';
	return result as Storyboard;
};

export const runStoryboardEdit = async (
	storyboard: Storyboard,
	signal: AbortSignal
): Promise<Storyboard> => {
	console.log('[LangGraph] runStoryboardEdit called with currentSlide:', storyboard.currentSlide);
	console.log(
		'[LangGraph] runStoryboardEdit will generate image for slide outline at index:',
		storyboard.currentSlide - 1
	);
	const app = createStoryboardGraph("edit");

	const result = await app.invoke(storyboard, { signal });
	console.log('[LangGraph] runStoryboardEdit result:', result);
	addLog(`[LangGraph] runStoryboardEdit result: ${JSON.stringify(result)}`);

	result.updatedAt = new Date();
	result.status = 'done';
	return result as Storyboard;
};