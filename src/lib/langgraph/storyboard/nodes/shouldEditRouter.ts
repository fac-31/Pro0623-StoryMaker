import type { Storyboard } from '$lib/models/storyboard.model';

export const shouldEditRouter = (state: Storyboard) => {
	const currentSlide = state.currentSlide ?? 1;
	const wantsEdit = state.userWantsEdit ?? false; 
	console.log(`[LangGraph] shouldEdit: slide ${currentSlide}, user wants edit: ${wantsEdit}`);
  	return wantsEdit ? 'reprompt' : 'continue';
};