import type { Storyboard } from '$lib/models/storyboard.model';
import { addLog } from '$lib/server/storyboardLogStore';

export const saveAndAdvance = async (state: Storyboard): Promise<Partial<Storyboard>> => {
	console.log('[LangGraph] saveAndAdvance called for slide:', state.currentSlide);
	addLog(`[LangGraph] saveAndAdvance called for slide: ${state.currentSlide}`);

	const currentSlideNum = state.currentSlide;

	// Advance to next slide. mark complete is in the logic of shouldContinue()
	const nextSlide = currentSlideNum + 1;

	console.log('[LangGraph] saveAndAdvance nextSlide:', nextSlide);
	addLog(`[LangGraph] saveAndAdvance nextSlide: ${nextSlide}`);
	return {
		currentSlide: nextSlide
	};
};