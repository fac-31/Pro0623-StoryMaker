// load / update user details
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { updateUserSchema } from '$lib/schemas/user.schema';

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

		const result = updateUserSchema.safeParse({ name, email, password });

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, { errors });
		}

		const update: Parameters<typeof locals.supabase.auth.updateUser>[0] = {};
		if (name) update.data = { display_name: name };
		if (email) update.email = email;
		if (password) update.password = password;
		const { error } = await locals.supabase.auth.updateUser(update);
		if (error) return fail(400, { errors: { _errors: [error.message] } });
		return { success: true };
	}
};
