// load & enforce sessions / tokens. Also redirect to login if needed. yea

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return { user: locals.user };
};
