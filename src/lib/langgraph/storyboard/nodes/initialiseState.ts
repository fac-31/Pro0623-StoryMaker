import type { Storyboard } from '$lib/models/storyboard.model';

export const initialiseState = async (state: Storyboard): Promise<Storyboard> => {
	state.currentSlide = state.currentSlide ?? 1;
	state.visualSlides = state.visualSlides ?? [];
	state.prompts = state.prompts ?? {
		numSlides: 0,
		concept: '',
		storyStyle: '',
		targetAudience: '',
		genre: ''
	};
	state.mode = state.mode ?? 'create';
	return state;
};