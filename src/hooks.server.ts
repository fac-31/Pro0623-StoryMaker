import type { Handle } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';

export const handle: Handle = async ({event, resolve}) => {
    event.locals.supabase = getSupabase(event);
    const {
        data: { session }
    } = await event.locals.supabase.auth.getSession();
    event.locals.session = session;
    event.locals.user = session?.user ?? null;

    const response = await resolve(event);
    return response;
}