import type { Handle } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { getSupabase } from '$lib/supabaseServerClient';

let isInitialized = false;

export const handle: Handle = async ({ event, resolve }) => {
	console.log(`[${new Date().toISOString()}] [hooks.server.ts] Handle called`);

	if (!isInitialized) {
		console.log(`[${new Date().toISOString()}] [hooks.server.ts] Initializing MongoDB...`);
		await initDB();
		console.log(`[${new Date().toISOString()}] [hooks.server.ts] MongoDB initialized`);
		isInitialized = true;
	}

	console.log(`[${new Date().toISOString()}] [hooks.server.ts] Getting Supabase client`);
	event.locals.supabase = getSupabase(event);

	console.log(`[${new Date().toISOString()}] [hooks.server.ts] Getting Supabase user`);
	const {
		data: { user },
		error: userError
	} = await event.locals.supabase.auth.getUser();

	if (userError) {
		console.error(
			`[${new Date().toISOString()}] [hooks.server.ts] Error in supabase.auth.getUser():`,
			userError.message
		);
	}
	event.locals.user = user ?? null;

	console.log(`[${new Date().toISOString()}] [hooks.server.ts] Resolving request`);
	const response = await resolve(event);

	// Optionally, log the response status for debugging
	console.log(`[${new Date().toISOString()}] [hooks.server.ts] Response status:`, response.status);

	return response;
};
