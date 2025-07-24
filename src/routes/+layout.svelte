<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		if ('serviceWorker' in navigator) {
			const base = import.meta.env.BASE_URL;
			navigator.serviceWorker.register(`${base}service-worker.js`);
		}

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mediaQuery.matches) {
			document.body.classList.add('no-motion');
		}

		const handleChange = () => {
			if (mediaQuery.matches) {
				document.body.classList.add('no-motion');
			} else {
				document.body.classList.remove('no-motion');
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});
</script>

<div class="bg-base-100 min-h-screen">
	<!-- Skip Links -->
	<a
		href="#main-content"
		class="focus:bg-primary focus:text-primary-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
	>
		Skip to main content
	</a>

	<main
		id="main-content"
		class="container mx-auto"
		aria-label="Main application content"
		tabindex="-1"
	>
		<slot />
	</main>
</div>
