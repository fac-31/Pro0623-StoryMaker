import type { Storyboard } from '../../models/storyboard.model';
import { addLog } from '$lib/server/storyboardLogStore';

export const saveSlideAndAdvance = async (state: Storyboard): Promise<Partial<Storyboard>> => {
	console.log('[LangGraph] saveSlideAndAdvance called for slide:', state.currentSlide);
	addLog(`[LangGraph] saveSlideAndAdvance called for slide: ${state.currentSlide}`);

	const currentSlideNum = state.currentSlide;

	// Advance to next slide. mark complete is in the logic of shouldContinue()
	const nextSlide = currentSlideNum + 1;

	console.log('[LangGraph] saveSlideAndAdvance nextSlide:', nextSlide);
	addLog(`[LangGraph] saveSlideAndAdvance nextSlide: ${nextSlide}`);
	return {
		currentSlide: nextSlide
	};
};
