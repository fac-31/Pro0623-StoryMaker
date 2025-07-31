import { StateGraph } from '@langchain/langgraph';
import type { Storyboard } from '$lib/models/storyboard.model';
import {
	generateStoryOutline,
	generateCharacterSheet,
	generateImage,
	saveAndAdvance,
	shouldContinue,
	initialiseState,
	shouldEditNode,
	reprompt,
	shouldEditRouter

} from './nodes';

type storyboardUpdate = Partial<Storyboard>

export const createStoryboardGraph = (mode: 'create' | 'edit' = 'create') => {
	const workflow = new StateGraph<Storyboard, Storyboard, storyboardUpdate, string>({
		channels: {
			_id: null,
			status: null,
			prompts: null,
			createdAt: null,
			updatedAt: null,
			storyOutline: null,
			currentSlide: null,
			visualSlides: null,
			characterSheet: null,
			mode: null,
			userWantsEdit: null,
			editHistory: null,
			userAction: null
		}
	});

	// Add nodes
	workflow.addNode('initialiseState', initialiseState);
	workflow.addNode('generateImage', generateImage);
	workflow.addNode('saveAndAdvance', saveAndAdvance);
	workflow.addNode('shouldEdit', shouldEditNode);
	workflow.addNode('reprompt', reprompt);

	if (mode === 'create') {
		workflow.addNode('generateStoryOutline', generateStoryOutline);
		workflow.addNode('generateCharacterSheet', generateCharacterSheet);

		workflow.addEdge('__start__', 'initialiseState');
		workflow.addEdge('initialiseState', 'generateStoryOutline');
		workflow.addEdge('generateStoryOutline', 'generateCharacterSheet');
		workflow.addEdge('generateCharacterSheet', 'generateImage');
		workflow.addEdge('generateImage', 'shouldEdit');
		workflow.addConditionalEdges('shouldEdit', shouldEditRouter, {
			reprompt: 'reprompt',
			continue: 'saveAndAdvance'
		});
		workflow.addEdge('reprompt', 'generateImage');
		workflow.addConditionalEdges('saveAndAdvance', shouldContinue, {
			nextSlide: 'generateImage',
			complete: '__end__'
		});
	} else {
		workflow.addEdge('__start__', 'initialiseState');
		workflow.addEdge('initialiseState', 'generateImage');
		workflow.addEdge('generateImage', 'shouldEdit');
		workflow.addConditionalEdges('shouldEdit', shouldEditRouter, {
			reprompt: 'reprompt',
			continue: 'saveAndAdvance'
		});
		workflow.addEdge('reprompt', 'generateImage');
		workflow.addConditionalEdges('saveAndAdvance', shouldContinue, {
			nextSlide: 'generateImage',
			complete: '__end__'
		});
	}

	return workflow.compile();
};