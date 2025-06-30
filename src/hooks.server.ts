import type { Handle } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = getSupabase(event);
	// Securely retrieve current user by revalidating session with Supabase Auth server
	const {
		data: { user },
		error: userError
	} = await event.locals.supabase.auth.getUser();
	if (userError) {
		console.error('Error in supabase.auth.getUser():', userError.message);
	}
	event.locals.user = user ?? null;

	const response = await resolve(event);
	return response;
};
