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
import { getDB } from '$lib/server/db';
import { ObjectId, type UpdateFilter } from 'mongodb';
import type { User } from '$lib/models/user.model';

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
	signal: AbortSignal,
	userId: string,
	teamId?: string
): Promise<Storyboard> => {
	console.log('[LangGraph] runStoryboardCreation called with:', storyboard.prompts);
	addLog(`[LangGraph] runStoryboardCreation called with: ${storyboard.prompts}`);
	const app = createStoryboardGraph();

	storyboard.currentSlide = 1;

	// Phase 1: Generate the outline in memory
	const outlineResult = await app.invoke(storyboard, { signal });

	if (!outlineResult.storyOutline) {
		throw new Error('Failed to generate storyboard outline.');
	}

	// Phase 2: Save to database
	const db = await getDB();
	const newStoryboard = {
		...outlineResult,
		userId: new ObjectId(userId),
		teamId: teamId ? new ObjectId(teamId) : undefined,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const insertedStoryboard = await db.collection('storyboards').insertOne(newStoryboard);
	const storyboardId = insertedStoryboard.insertedId;

	if (teamId) {
		await db
			.collection('teams')
			.updateOne(
				{ _id: new ObjectId(teamId) },
				{ $push: { projects: storyboardId } as unknown as UpdateFilter<User> }
			);
	} else {
		await db
			.collection('users')
			.updateOne(
				{ _id: new ObjectId(userId) },
				{ $push: { projects: storyboardId } as unknown as UpdateFilter<User> }
			);
	}

	// Phase 3: Generate images and complete the storyboard
	try {
		const finalResult = await app.invoke(newStoryboard, { signal });
		console.log('[LangGraph] runStoryboardCreation result:', finalResult);
		addLog(`[LangGraph] runStoryboardCreation result: ${JSON.stringify(finalResult)}`);

		finalResult.updatedAt = new Date();
		finalResult.status = 'done';
		return finalResult as Storyboard;
	} catch (error) {
		// Cleanup failed storyboard
		await db.collection('storyboards').deleteOne({ _id: storyboardId });
		if (teamId) {
			await db
				.collection('teams')
				.updateOne(
					{ _id: new ObjectId(teamId) },
					{ $pull: { projects: storyboardId } as unknown as UpdateFilter<User> }
				);
		} else {
			await db
				.collection('users')
				.updateOne(
					{ _id: new ObjectId(userId) },
					{ $pull: { projects: storyboardId } as unknown as UpdateFilter<User> }
				);
		}
		throw error;
	}
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
