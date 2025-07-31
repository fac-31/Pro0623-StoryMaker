import type { Storyboard } from '$lib/models/storyboard.model';
import { addLog } from '$lib/server/storyboardLogStore';


export const reprompt = async (state: Storyboard): Promise<Partial<Storyboard>> => {
	const currentIndex = (state.currentSlide ?? 1) - 1;
	const newPrompt = state.prompts?.[currentIndex];

	if (!newPrompt) {
		addLog(`[LangGraph] reprompt: No new prompt found for slide ${currentIndex + 1}`);
		return {};
	};

	addLog(`[LangGraph] reprompt: Using new prompt for slide ${currentIndex + 1}: ${newPrompt}`);   


	return { 
		userAction: undefined,
		userWantsEdit: false
	};
};