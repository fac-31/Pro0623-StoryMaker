import type { Storyboard } from '$lib/models/storyboard.model';

export async function progressStoryboard(id: string, edit: boolean): Promise<Storyboard | null> {
	return new Promise((resolve, reject) => {
		const source = new EventSource(`/api/storyboard/progress/${id}${edit ? '?edit=true' : ''}`);
		let latestStoryboard: Storyboard | null = null;

		source.onmessage = (event) => {
			latestStoryboard = JSON.parse(event.data);

			if (latestStoryboard && latestStoryboard.status == 'done') {
				source.close();
				resolve(latestStoryboard);
			}
		};

		source.onerror = (err) => {
			console.error('SSE connection error', err);
			source.close();
			reject(new Error('SSE connection error'));
		};
	});
}