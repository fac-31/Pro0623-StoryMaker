/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = Array.from(new Set([...build, ...files, '/offline.html'])).filter(
	(asset) => !asset.endsWith('.gitkeep') && !asset.startsWith('/games/')
);

self.addEventListener('install', (event: ExtendableEvent) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE).then((cache) =>
			cache.addAll(ASSETS).catch((err) => {
				console.error('Cache addAll failed:', err, ASSETS);
				throw err;
			})
		)
	);
});

self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
	);
});

self.addEventListener('fetch', (event: FetchEvent) => {
	if (event.request.method !== 'GET') return;

	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request).catch(async () => {
				const cached = await caches.match('/offline.html');
				return cached ?? new Response('Offline', { status: 503, statusText: 'Offline' });
			})
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cached) => {
			if (cached) return cached;
			return fetch(event.request).then((response) => {
				const clone = response.clone();
				caches.open(CACHE).then((cache) => cache.put(event.request, clone));
				return response;
			});
		})
	);
});
