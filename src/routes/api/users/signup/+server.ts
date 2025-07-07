import type { InsertOneResult } from 'mongodb';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabaseServerClient';
import { insertUser } from '$lib/server/userService';
import type { UserSignup } from '$lib/models/user.model';

export async function POST(event: RequestEvent) {
	const info: UserSignup = await event.request.json();

	try {
		// Create a supabase user first
		const supabase = getSupabase(event);
		const { data, error: signUpError } = await supabase.auth.signUp({
			email: info.email,
			password: info.password,
			options: { data: { full_name: info.full_name, display_name: info.display_name } }
		});

		if (signUpError) {
			return json({ error: signUpError.message }, { status: 500 });
		}

		const supabaseId = data?.user?.id;
		if (!supabaseId) {
			return json({ error: 'Could not get id of created supabase' }, { status: 500 });
		}

		// Then create a mongodb user with inserted supabase id
		const result: InsertOneResult = await insertUser(supabaseId, info.display_name);
		return json({
			success: result.acknowledged,
			supabase: supabaseId,
			mongodb: result.insertedId
		});
	} catch (e) {
		console.error('Insert user failed:', e);
		return json({ error: 'Failed to insert user' }, { status: 500 });
	}
}
