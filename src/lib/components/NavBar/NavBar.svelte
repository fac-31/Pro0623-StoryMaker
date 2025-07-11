<script lang="ts">
	import { Menu, X, Play } from 'lucide-svelte';
	import { tick } from 'svelte'; // Import tick

	type NavType = 'home' | 'auth' | 'dashboard';
	/** Which variant of the navbar to render */
	export let type: NavType = 'home';
	/** Mobile menu open state */
	let mobileMenuOpen = false;
	let mobileMenuButtonElement: HTMLButtonElement; // For binding to the button

	$: if (typeof document !== 'undefined') {
		// Ensure code runs only in browser
		if (mobileMenuOpen) {
			tick().then(() => {
				const menuId = type === 'home' || type === 'auth' ? 'mobile-menu-marketing' : 'mobile-menu-dashboard';
				const menuElement = document.getElementById(menuId);
				if (menuElement) {
					// Make the menu container focusable if it isn't already
					menuElement.setAttribute('tabindex', '-1');
					// Try to focus the first interactive element, or the container itself
					const firstFocusable = menuElement.querySelector<HTMLElement>(
						'a[href], button:not([disabled])'
					);
					if (firstFocusable) {
						firstFocusable.focus();
					} else {
						menuElement.focus();
					}
				}
			});
		} else {
			// Only try to focus if mobileMenuButtonElement is available (it might not be on initial load server-side)
			if (mobileMenuButtonElement) {
				tick().then(() => {
					mobileMenuButtonElement.focus();
				});
			}
		}
	}
</script>

<header class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
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

			<!-- Mobile Menu Button -->
			<button
				bind:this={mobileMenuButtonElement}
				class="p-2 text-gray-500 hover:text-gray-800 md:hidden"
				on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-expanded={mobileMenuOpen}
				aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-controls={type === 'home' || type === 'auth' ? 'mobile-menu-marketing' : 'mobile-menu-dashboard'}
			>
				{#if mobileMenuOpen}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
			<slot name="nav" {mobileMenuOpen}></slot>
		</div>
	</div>
</header>
