<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let theme = $state('light');

	onMount(() => {
		// Get initial theme from localStorage or system preference
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			theme = savedTheme;
		} else {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		applyTheme(theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		applyTheme(theme);
		localStorage.setItem('theme', theme);
	}

	function applyTheme(newTheme: string) {
		document.documentElement.setAttribute('data-theme', newTheme);
	}
</script>

<button
	class="btn btn-ghost btn-circle"
	onclick={toggleTheme}
	aria-label="Toggle theme"
	title="Toggle between light and dark theme"
>
	{#if theme === 'light'}
		<Moon class="h-5 w-5" />
	{:else}
		<Sun class="h-5 w-5" />
	{/if}
	<span aria-live="polite" role="status" class="sr-only">
		{theme === 'light' ? 'Switched to light theme' : 'Switched to dark theme'}
	</span>
</button>
