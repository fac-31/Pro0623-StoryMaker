import { supabase } from '$lib/supabaseBrowserClient';
import { redirect } from '@sveltejs/kit';

export async function POST() {
	await supabase.auth.signOut();
	throw redirect(303, '/login');
}
