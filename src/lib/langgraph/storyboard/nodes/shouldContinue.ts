import type { Storyboard } from '$lib/models/storyboard.model';

export const shouldContinue = (state: Storyboard): 'awaitingUser' | 'reprompt' | 'nextSlide' | 'complete' => {
	  if (!state.userAction) return 'awaitingUser'; // new edge
  		if (state.userAction === 'reprompt') return 'reprompt';
			return state.currentSlide && state.currentSlide < state.storyOutline.slideOutlines.length
			? 'nextSlide'
			: 'complete';

};