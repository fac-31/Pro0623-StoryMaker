import type { Storyboard } from '../../models/storyboard.model';

export const shouldContinue = (state: Storyboard): 'nextSlide' | 'complete' => {
	return state.currentSlide && state.currentSlide <= state.storyOutline.slideOutlines.length
		? 'nextSlide'
		: 'complete';
};
