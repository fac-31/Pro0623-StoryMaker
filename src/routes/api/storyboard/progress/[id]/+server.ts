import { json } from '@sveltejs/kit';
import { runStoryboardCreation, runStoryboardEdit } from '$lib/langgraph/storyboardGraph';
import { initDB } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { Storyboard } from '$lib/models/storyboard.model';
import { registerStream, updateStream, cancelStream, endStream } from '$lib/streams';
import { ObjectId } from 'mongodb';

/**
 * Handles GET requests for storyboard progress.
 *
 * @type {RequestHandler}
 * @async
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the storyboard.
 * @returns {Promise<Response>} A stream response for real-time updates or a JSON response for errors.
 *
 * @description
 * This function:
 * 1. Validates the provided storyboard ID.
 * 2. Retrieves the storyboard from the database.
 * 3. Sets up a ReadableStream for real-time updates.
 * 4. Initiates the storyboard creation process.
 * 5. Returns the stream response to the client.
 */
export const GET: RequestHandler = async ({ params, url }) => {
	const id = params.id;
	const edit = url.searchParams.get('edit') === 'true'; // false if not provided
	const slideNumber = url.searchParams.get('slideNumber'); // Get the specific slide number for edits
	if (!id) return json({ error: 'ID not provided' }, { status: 500 });

	const db = await initDB();
	const storyboards = db.collection<Storyboard>('storyboards');

	const storyboard: Storyboard | null = await storyboards.findOne({ _id: new ObjectId(id) });
	if (!storyboard) return json({ error: 'Invalid ID' }, { status: 500 });

	console.log(`[Progress] Fetched storyboard for ${edit ? 'edit' : 'creation'}, currentSlide: ${storyboard.currentSlide}`);

	const stream = new ReadableStream({
		start(controller) {
			const abortController = new AbortController();
			registerStream(id, controller, abortController);

			if (edit) {
				runAsyncStoryboardEdit(storyboard, abortController.signal).catch((err) => {
					console.error('Storyboard error:', err);
					endStream(id);
				});
			} else {
				runAsyncStoryboard(storyboard, abortController.signal).catch((err) => {
					console.error('Storyboard error:', err);
					endStream(id);
				});
			}
		},
		cancel() {
			cancelStream(id);
		}
	});

	/**
	 * Runs the storyboard creation process asynchronously.
	 *
	 * @async
	 * @param {Storyboard} storyboard - The storyboard to process.
	 * @returns {Promise<void>}
	 *
	 * @description
	 * This function:
	 * 1. Runs the storyboard creation process.
	 * 2. Updates the storyboard in the database with the result.
	 * 3. Sends the final update to the stream.
	 * 4. Ends the stream.
	 */
	async function runAsyncStoryboard(storyboard: Storyboard, signal: AbortSignal) {
		console.log('entered runAsync');
		const storyboardOutput: Storyboard = await runStoryboardCreation(storyboard, signal);

		await storyboards.updateOne({ _id: new ObjectId(id) }, { $set: storyboardOutput });

		updateStream(storyboard._id.toString(), storyboardOutput);
		endStream(storyboard._id.toString());
	}

	async function runAsyncStoryboardEdit(storyboard: Storyboard, signal: AbortSignal) {
		// If slideNumber is provided, override the currentSlide to ensure we edit the correct slide
		if (slideNumber) {
			storyboard.currentSlide = parseInt(slideNumber);
			console.log(`[Progress] Override currentSlide to: ${storyboard.currentSlide}`);
		}
		
		const storyboardOutput: Storyboard = await runStoryboardEdit(storyboard, signal);

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
