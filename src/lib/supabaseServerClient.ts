import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

export const getSupabase = (event: RequestEvent) =>
	createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				);
			}
		}
	});

/* {
        get: (name: string) => event.cookies.get(name),
        set: (name: string, value: string, options?: CookieOptionsWithName) =>
          event.cookies.set(name, value, { path: '/', ...options }),
        remove: (name: string, options?: CookieOptionsWithName) =>
          event.cookies.delete(name, { path: '/', ...options })
      } as CookieMethodsServerDeprecated
    }
  );*/
