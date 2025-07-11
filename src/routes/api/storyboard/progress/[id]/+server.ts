import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { Storyboard } from '$lib/models/storyboard.model';
import { registerStream, updateStream, endStream } from '$lib/streams';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) return json({ error: 'ID not provided' }, { status: 500 });

	const db = await initDB();
	const storyboards = db.collection<Storyboard>('storyboards');

	const storyboard: Storyboard | null = await storyboards.findOne({ _id: new ObjectId(id) });
	if (!storyboard) return json({ error: 'Invalid ID' }, { status: 500 });

	const stream = new ReadableStream({
		start(controller) {
			registerStream(id, controller);

			runAsyncStoryboard(storyboard).catch((err) => {
				console.error('Storyboard error:', err);
				endStream(id);
			});
		},

		cancel() {
			// Cleanup if the client disconnects
			endStream(id);
		}
	});

	async function runAsyncStoryboard(storyboard: Storyboard) {
		const storyboardOutput: Storyboard = await runStoryboardCreation(storyboard);

		await storyboards.updateOne({ _id: new ObjectId(id) }, { $set: storyboardOutput });

		updateStream(storyboard._id.toString(), storyboardOutput);
		endStream(storyboard._id.toString());
	}

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
