import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

import { teamRoles } from '$lib/models/team.model';
import { getUserFromEvent } from '$lib/server/userService';
import { canUserEditTeam, updateTeamUser } from '$lib/server/teamService';

export async function POST(event: RequestEvent) {
	const info = await event.request.json();

	const user = await getUserFromEvent(event);
	if (!user) return json({ error: 'User not logged in' }, { status: 401 });

	try {
		const result = await canUserEditTeam(info.team_id, user._id.toString());
		if (result !== true) return json({ error: result }, { status: 401 });

		if (!teamRoles.includes(info.role))
			return json({ error: 'Invalid role ' + info.role }, { status: 401 });

		await updateTeamUser(info.team_id, info.user_id, info.role);
		return json({ success: true });
	} catch (e) {
		console.error('Insert team failed:', e);
		return json({ error: 'Failed to insert team' }, { status: 500 });
	}
}
