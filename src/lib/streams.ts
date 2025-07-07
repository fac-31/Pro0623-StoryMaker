const streams = new Map<string, ReadableStreamDefaultController>();

export function registerStream(taskId: string, controller: ReadableStreamDefaultController) {
	streams.set(taskId, controller);
}

export function updateStream(taskId: string, data: { [key: string]: unknown }, end: boolean = false) {
	const controller = streams.get(taskId);
	if (!controller) return;

	const encoder = new TextEncoder();
	controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

	if (end) {
		controller.close();
		streams.delete(taskId);
	}
}