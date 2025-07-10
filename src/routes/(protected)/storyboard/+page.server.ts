// import type { PageServerLoad } from './$types';

export const load = async ({ locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		throw new Error('User not authenticated');
	}

	console.log('Storyboard page load for user:', userId);
	return {
		userId
	};
};
