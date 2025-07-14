import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

/**
 * Defines the server-side actions for the signup page.
 * @type {Actions}
 */
export const actions: Actions = {
    /**
     * Handles the signup form submission.
     * 
     * @async
     * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
     * @returns {Promise<import('@sveltejs/kit').ActionFailure<{ error: string }> | void>} 
     *          Returns a failure object if signup fails, or redirects on success.
     * 
     * @throws {import('@sveltejs/kit').Redirect} Redirects to the login page on successful signup.
     * 
     * @description
     * This function processes the signup form submission. It:
     * 1. Extracts email and password from the form data.
     * 2. Validates that both email and password are provided.
     * 3. Attempts to sign up the user using Supabase authentication.
     * 4. Handles signup errors.
     * 5. Redirects to the login page on successful signup.
     */
    default: async (event) => {
        const form = await event.request.formData();
        const email = form.get('email')?.toString() ?? '';
        const password = form.get('password')?.toString() ?? '';

        if (!email || !password) {
            return fail(400, { error: 'Email and password required' });
        }

        const supabase = getSupabase(event);

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return fail(400, { error: error.message });
        }

        throw redirect(303, '/login');
    }
};