// load / update user details
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	console.log(locals.user);
	return { user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name')?.toString() ?? '';
		const email = form.get('email')?.toString() ?? '';
		const password = form.get('password')?.toString() ?? '';
		const update: Parameters<typeof locals.supabase.auth.updateUser>[0] = {};
		if (name) update.data = { display_name: name };
		if (email) update.email = email;
		if (password) update.password = password;
		const { error } = await locals.supabase.auth.updateUser(update);
		if (error) return fail(400, { error: error.message });
		return { success: true };
	}
};
