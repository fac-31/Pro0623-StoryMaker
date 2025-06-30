// load / update user details
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { name } = Object.fromEntries(await request.formData());
		await locals.supabase.auth.updateUser({ data: { name } });
		return { success: true };
	}
};
