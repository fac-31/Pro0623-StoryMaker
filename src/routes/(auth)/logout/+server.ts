import type { RequestHandler } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

/**
 * Handles POST requests to the logout endpoint.
 * 
 * @type {RequestHandler}
 * @async
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
 * @returns {Promise<Response>} A response object that redirects to the home page.
 * 
 * @description
 * This function processes the logout request. It:
 * 1. Initializes a Supabase client using the request event.
 * 2. Signs out the user from Supabase.
 * 3. Manually clears Supabase-related cookies (as a precaution).
 * 4. Returns a redirect response to the home page.
 * 
 * Note: The manual cookie clearing is done as a precautionary measure,
 * in case Supabase doesn't clear them automatically during signOut.
 */
export const POST: RequestHandler = async (event) => {
    const supabase = getSupabase(event);
    await supabase.auth.signOut();

    // Clear cookies manually (optional, if supabase does not clear them)
    event.cookies.delete('sb-access-token', { path: '/' });
    event.cookies.delete('sb-refresh-token', { path: '/' });

    return new Response(null, {
        status: 303,
        headers: { location: '/' }
    });
};