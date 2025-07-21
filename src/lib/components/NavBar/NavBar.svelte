<script lang="ts">
	import { Menu, X, Play } from 'lucide-svelte';
	import ThemeToggle from '../ThemeToggle.svelte';
	import { onMount, tick } from 'svelte';

	/** Mobile menu open state */
	let mobileMenuOpen = false;
	let navMenu: HTMLElement;
	let menuButton: HTMLButtonElement;

	function handleFocus(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const focusableElements = navMenu.querySelectorAll(
			'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		);
		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				lastElement.focus();
				event.preventDefault();
			}
		} else {
			if (document.activeElement === lastElement) {
				firstElement.focus();
				event.preventDefault();
			}
		}
	}

	async function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) {
			await tick();
			const firstElement = navMenu.querySelector(
				'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
			) as HTMLElement;
			firstElement?.focus();
		} else {
			menuButton.focus();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleFocus);
		return () => {
			document.removeEventListener('keydown', handleFocus);
		};
	});
</script>

<header
	class="navbar bg-base-100/80 border-base-200 sticky top-0 z-50 border-b backdrop-blur-md"
	aria-label="Main navigation"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-4">
			<div class="flex items-center space-x-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<Play class="h-4 w-4 text-white" />
				</div>
				<span
					class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent"
				>
					StoryMaker
				</span>
			</div>
			<div class="flex items-center space-x-8" bind:this={navMenu}>
				<slot name="nav" {mobileMenuOpen}></slot>
				<ThemeToggle />
				<button
					class="btn btn-ghost btn-square md:hidden"
					on:click={toggleMobileMenu}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
					bind:this={menuButton}
				>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</header>
