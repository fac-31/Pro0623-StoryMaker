<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			const base = import.meta.env.BASE_URL;
			navigator.serviceWorker.register(`${base}service-worker.js`);
		}
	});
</script>

{@render children()}
