import type { RequestHandler } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

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
