const streams = new Map<string, ReadableStreamDefaultController>();

export function registerStream(taskId: string, controller: ReadableStreamDefaultController) {
	streams.set(taskId, controller);
}

export function updateStream(taskId: string, data: unknown) {
	const controller = streams.get(taskId);
	if (!controller) return;

	const encoder = new TextEncoder();
	controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

export function endStream(taskId: string) {
	const controller = streams.get(taskId);
	if (!controller) return;

	controller.close();
	streams.delete(taskId);
}
