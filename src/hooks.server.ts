import { initDB } from '$lib/server/db';

let isInitialized = false;

export async function handle({ event, resolve }) {
	if (!isInitialized) {
		await initDB(); // Connect to MongoDB once
		isInitialized = true; // Flag to avoid reconnecting
	}

	return resolve(event);
}
