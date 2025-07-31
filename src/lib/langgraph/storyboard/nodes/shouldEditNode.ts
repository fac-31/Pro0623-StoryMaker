import type { Storyboard } from "$lib/models/storyboard.model";

export const shouldEditNode = (state: Storyboard) => {
  const value: 'reprompt' | 'approve' = state.userWantsEdit ? 'reprompt' : 'approve';
  return { userAction: value};
};