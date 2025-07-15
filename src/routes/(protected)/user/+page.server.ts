// load / update user details
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name')?.toString() ?? '';
		const email = form.get('email')?.toString() ?? '';
		const password = form.get('password')?.toString() ?? '';
		const errors: Record<string, string> = {};
		if (!name) {
			errors.name = 'Display name is required';
		}
		const update: Parameters<typeof locals.supabase.auth.updateUser>[0] = {};
		if (name) update.data = { display_name: name };
		if (email) update.email = email;
		if (password) update.password = password;

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}
		const { error } = await locals.supabase.auth.updateUser(update);
		if (error) {
			const errors: Record<string, string> = {};
			if (error.message.includes('email')) {
				errors.email = error.message;
			} else if (error.message.includes('password')) {
				errors.password = error.message;
			} else {
				errors.form = error.message;
			}
			return fail(400, { errors });
		}
		return { success: true };
	}
};
