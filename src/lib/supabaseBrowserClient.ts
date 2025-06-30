import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_ANON_KEY
);
