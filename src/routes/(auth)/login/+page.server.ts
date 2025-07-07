// src/routes/login/+page.server.ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const email = form.get('email')?.toString() ?? '';
		const password = form.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { error: 'Email and password required' });
		}

		const supabase = getSupabase(event);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(303, '/storyboard');
	}
};
