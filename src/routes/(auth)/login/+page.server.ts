// src/routes/login/+page.server.ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

/**
 * Defines the server-side actions for the login page.
 * @type {Actions}
 */
export const actions: Actions = {
    /**
     * Handles the login form submission.
     * 
     * @async
     * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
     * @returns {Promise<import('@sveltejs/kit').ActionFailure<{ error: string }> | void>} 
     *          Returns a failure object if login fails, or redirects on success.
     * 
     * @throws {import('@sveltejs/kit').Redirect} Redirects to the dashboard on successful login.
     * 
     * @description
     * This function processes the login form submission. It:
     * 1. Extracts email and password from the form data.
     * 2. Validates that both email and password are provided.
     * 3. Attempts to sign in using Supabase authentication.
     * 4. Handles authentication errors.
     * 5. Redirects to the dashboard on successful login.
     */
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

        throw redirect(303, '/dashboard');
    }
};
