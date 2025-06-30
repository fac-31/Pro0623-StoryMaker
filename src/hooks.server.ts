import type { Handle } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { getSupabase } from '$lib/supabaseServerClient';

let isInitialized = false;

export const handle: Handle = async ({ event, resolve }) => {
	if (!isInitialized) {
		await initDB(); // Connect to MongoDB once
		isInitialized = true; // Flag to avoid reconnecting
	}

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
