import { json } from '@sveltejs/kit';
import { getLogs } from '$lib/server/storyboardLogStore';

export const GET = async () => {
	return json(getLogs());
};
