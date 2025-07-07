import type { InsertOneResult } from 'mongodb';

import { json } from '@sveltejs/kit';
import { insertProject } from '$lib/server/projectService';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/project.model';

export const POST: RequestHandler = async ({ request }) => {
	const prompts: UserPrompt = await request.json();

	try {
		const result: InsertOneResult = await insertProject(prompts);
		return json({
			success: result.acknowledged,
			insertedId: result.insertedId,
		});
	} catch (e) {
		console.error('Insert project failed:', e);
		return json({ error: 'Failed to insert project' }, { status: 500 });
	}
};
