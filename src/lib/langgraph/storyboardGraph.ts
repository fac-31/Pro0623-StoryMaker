import dotenv from 'dotenv';
dotenv.config();

import { StateGraph } from '@langchain/langgraph';
import { addLog } from '$lib/server/storyboardLogStore';
import type { Storyboard } from '$lib/models/storyboard.model';
import {
	generateStoryOutline,
	generateCharacterSheet,
	generateImage,
	saveSlideAndAdvance,
	shouldContinue
} from './nodes';

/**
 * Creates and compiles the storyboard graph workflow.
 * @returns {StateGraph} The compiled storyboard graph workflow.
 */
export const createStoryboardGraph = () => {
	console.log('[LangGraph] createStoryboardGraph called');
	addLog('[LangGraph] createStoryboardGraph called');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const workflow = new StateGraph<Storyboard, any, any, string>({
		channels: {
			_id: null,
			status: null,
			prompts: null,
			createdAt: null,
			updatedAt: null,
			storyOutline: null,
			currentSlide: null,
			visualSlides: null,
			characterSheet: null
		}
	});

	// Add nodes
	workflow.addNode('generateStoryOutline', generateStoryOutline);
	workflow.addNode('generateCharacterSheet', generateCharacterSheet);
	workflow.addNode('generateImage', generateImage);
	workflow.addNode('saveAndAdvance', saveSlideAndAdvance);

	// Define edges using '__start__' and '__end__' as required
	workflow.addEdge('__start__', 'generateStoryOutline');
	workflow.addEdge('generateStoryOutline', 'generateCharacterSheet');
	workflow.addEdge('generateCharacterSheet', 'generateImage');
	workflow.addEdge('generateImage', 'saveAndAdvance');
	workflow.addConditionalEdges('saveAndAdvance', shouldContinue, {
		nextSlide: 'generateImage',
		complete: '__end__'
	});

	return workflow.compile();
};

/**
 * Creates and compiles the storyboard graph workflow.
 * @returns {StateGraph} The compiled storyboard graph workflow.
 */
export const createStoryboardEditGraph = () => {
	console.log('[LangGraph] createStoryboardEditGraph called');
	addLog('[LangGraph] createStoryboardEditGraph called');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const workflow = new StateGraph<Storyboard, any, any, string>({
		channels: {
			_id: null,
			status: null,
			prompts: null,
			createdAt: null,
			updatedAt: null,
			storyOutline: null,
			currentSlide: null,
			visualSlides: null,
			characterSheet: null
		}
	});

	// Add nodes
	workflow.addNode('generateImage', generateImage);

	// Define edges using '__start__' and '__end__' as required
	workflow.addEdge('__start__', 'generateImage');
	workflow.addEdge('generateImage', '__end__');

	return workflow.compile();
};

/**
 * Runs the storyboard creation process.
 * @param {Storyboard} storyboard - The initial storyboard state.
 * @returns {Promise<Storyboard>} A promise that resolves to the completed storyboard.
 */
export const runStoryboardCreation = async (
	storyboard: Storyboard,
	signal: AbortSignal
): Promise<Storyboard> => {
	console.log('[LangGraph] runStoryboardCreation called with:', storyboard.prompts);
	addLog(`[LangGraph] runStoryboardCreation called with: ${storyboard.prompts}`);
	const app = createStoryboardGraph();

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
	const app = createStoryboardEditGraph();

	const result = await app.invoke(storyboard, { signal });
	console.log('[LangGraph] runStoryboardEdit result:', result);
	addLog(`[LangGraph] runStoryboardEdit result: ${JSON.stringify(result)}`);

	result.updatedAt = new Date();
	result.status = 'done';
	return result as Storyboard;
};
