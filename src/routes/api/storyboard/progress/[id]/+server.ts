import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { getProjectById } from '$lib/server/projectService';
import type { RequestHandler } from '@sveltejs/kit';
import type { Project } from '$lib/models/project.model';
import { registerStream } from '$lib/streams';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id)
		return json({ error: 'ID param not given' }, { status: 404 });
	
	const project: Project | null = await getProjectById(id);
	if (!project)
		return json({ error: 'Could not find project by ID' }, { status: 404 });

	const stream = new ReadableStream({
		start(controller) {
			registerStream(id, controller);
		}
	});

	await runStoryboardCreation(project);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
