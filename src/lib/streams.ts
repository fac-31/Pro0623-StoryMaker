/** A map to store active streams, keyed by task ID. */
const streams = new Map<string, ReadableStreamDefaultController>();

/**
 * Registers a new stream controller for a given task ID.
 * @param {string} taskId - The unique identifier for the task.
 * @param {ReadableStreamDefaultController} controller - The controller for the stream.
 */
export function registerStream(taskId: string, controller: ReadableStreamDefaultController) {
	streams.set(taskId, controller);
}

/**
 * Updates a stream with new data for a given task ID.
 * @param {string} taskId - The unique identifier for the task.
 * @param {unknown} data - The data to be sent through the stream.
 */
export function updateStream(taskId: string, data: unknown) {
	const controller = streams.get(taskId);
	if (!controller) return;

	try {
		const encoder = new TextEncoder();
		controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
	} catch (error) {
		console.warn(`Failed to update stream ${taskId}:`, error);
		// Remove the controller if it's already closed
		streams.delete(taskId);
	}
}

/**
 * Ends a stream for a given task ID, closing the controller and removing it from the map.
 * @param {string} taskId - The unique identifier for the task.
 */
export function endStream(taskId: string) {
	const controller = streams.get(taskId);
	if (!controller) return;

	try {
		controller.close();
	} catch (error) {
		console.warn(`Failed to close stream ${taskId}:`, error);
	} finally {
		streams.delete(taskId);
	}
}
