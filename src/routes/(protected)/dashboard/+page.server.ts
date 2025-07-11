// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsOfUser } from '$lib/server/storyboardService.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const storyboards = await getStoryboardsOfUser(user.id);

	return {
		user,
		storyboards
	};
};
