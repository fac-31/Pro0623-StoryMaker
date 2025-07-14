import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Creates and returns a Supabase server client for the given request event.
 * 
 * @param {RequestEvent} event - The SvelteKit request event object.
 * @returns {ReturnType<typeof createServerClient>} A Supabase server client instance.
 * 
 * @description
 * This function initializes a Supabase server client with the public Supabase URL and anonymous key.
 * It sets up custom cookie handling methods to work with SvelteKit's event.cookies API.
 * 
 * The returned client can be used to interact with Supabase services server-side,
 * with automatic handling of authentication cookies.
 */
export const getSupabase = (event: RequestEvent) =>
    createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            /**
             * Retrieves all cookies from the request event.
             * @returns {Array} An array of all cookies.
             */
            getAll() {
                return event.cookies.getAll();
            },
            /**
             * Sets multiple cookies in the response.
             * @param {Array} cookiesToSet - An array of cookie objects to set.
             */
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    event.cookies.set(name, value, { ...options, path: '/' })
                );
            }
        }
    });

/* Deprecated cookie methods:
{
    get: (name: string) => event.cookies.get(name),
    set: (name: string, value: string, options?: CookieOptionsWithName) =>
        event.cookies.set(name, value, { path: '/', ...options }),
    remove: (name: string, options?: CookieOptionsWithName) =>
        event.cookies.delete(name, { path: '/', ...options })
} as CookieMethodsServerDeprecated
*/