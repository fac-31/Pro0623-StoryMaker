import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

import { getUserFromEvent } from '$lib/server/userService';
import { canUserEditTeam, removeTeamUser } from '$lib/server/teamService';

export async function POST(event: RequestEvent) {
	const info = await event.request.json();

	const user = await getUserFromEvent(event);
	if (!user) return json({ error: 'User not logged in' }, { status: 401 });

	try {
		const result = await canUserEditTeam(info.team_id, info.user_id);
		if (result !== true) return json({ error: result }, { status: 401 });

		if (user._id.equals(info.user_id))
			return json({ error: 'You cannot remove yourself from team' }, { status: 401 });

		await removeTeamUser(info.team_id, info.user_id);
		return json({ success: true });
	} catch (e) {
		console.error('Insert team failed:', e);
		return json({ error: 'Failed to insert team' }, { status: 500 });
	}
}
