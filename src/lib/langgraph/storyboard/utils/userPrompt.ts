import type { Storyboard } from "$lib/models/storyboard.model";
import type { UserPrompt } from "$lib/models/UserPrompt";

export const getCurrentPrompt = (state: Storyboard): UserPrompt | undefined => {
	return state.prompts?.[state.prompts.length - 1];
};