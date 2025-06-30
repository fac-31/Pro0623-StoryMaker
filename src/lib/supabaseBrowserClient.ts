import { createBrowserClient } from '@supabase/ssr';
import 'dotenv/config';

const supa_url = process.env.SUPABASE_URL;
const supa_key = process.env.SUPABASE_ANON_KEY;

if (!supa_key || !supa_url) {
	throw new Error('Supabase env variables not set');
}

export const supabase = createBrowserClient(supa_url, supa_key);
