import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';

export function getSupabase(event: RequestEvent) {
	return createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY, {
		cookies: {
			get: (name) => event.cookies.get(name),
			set: (name, value, options) => event.cookies.set(name, value, { path: '/', ...options }),
			remove: (name, options) => event.cookies.delete(name, { path: '/', ...options })
		}
	});
}
