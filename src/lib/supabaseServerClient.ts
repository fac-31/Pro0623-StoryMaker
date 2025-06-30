import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function getSupabase(event: RequestEvent) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (name) => event.cookies.get(name),
			set: (name, value, options) => event.cookies.set(name, value, { path: '/', ...options }),
			remove: (name, options) => event.cookies.delete(name, { path: '/', ...options })
		}
	});
}
