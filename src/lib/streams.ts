// streams.ts

type StreamData = {
	controller: ReadableStreamDefaultController;
	abortController: AbortController;
};

const streams = new Map<string, StreamData>();

/**
 * Registers a new stream with its controller and abort controller.
 * @param taskId - The unique task ID.
 * @param controller - The ReadableStream controller.
 * @param abortController - The associated AbortController.
 */
export function registerStream(
	taskId: string,
	controller: ReadableStreamDefaultController,
	abortController: AbortController
) {
	streams.set(taskId, { controller, abortController });
}

/**
 * Pushes data to the stream associated with a task ID.
 * @param taskId - The task ID to send data to.
 * @param data - The data to send.
 */
export function updateStream(taskId: string, data: unknown) {
	const streamData = streams.get(taskId);
	if (!streamData) return;

	const encoder = new TextEncoder();
	streamData.controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

/**
 * Ends the stream, closing it and cleaning up the map.
 * @param taskId - The task ID to close.
 */
export function endStream(taskId: string) {
	const streamData = streams.get(taskId);
	if (!streamData) return;

	const { controller, abortController } = streamData;
	if (!abortController.signal.aborted) {
		controller.close();
	}
	streams.delete(taskId);
}

/**
 * Cancels the stream early via abort signal.
 * @param taskId - The task ID to cancel.
 */
export function cancelStream(taskId: string) {
	const streamData = streams.get(taskId);
	if (!streamData) return;

	streamData.abortController.abort();
	streams.delete(taskId);
}
