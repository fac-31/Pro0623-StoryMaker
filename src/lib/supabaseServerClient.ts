import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import 'dotenv/config';

const supa_url = process.env.SUPABASE_URL;
const supa_key = process.env.SUPABASE_ANON_KEY;

if (!supa_key || !supa_url) {
	throw new Error('Supabase env variables not set');
}

export function getSupabase(event: RequestEvent) {
	return createServerClient(supa_url!, supa_key!, {
		cookies: {
			get: (name) => event.cookies.get(name),
			set: (name, value, options) => event.cookies.set(name, value, { path: '/', ...options }),
			remove: (name, options) => event.cookies.delete(name, { path: '/', ...options })
		}
	});
}
