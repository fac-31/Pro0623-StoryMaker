<script lang="ts">
	import { Menu, X, Play } from 'lucide-svelte';
	import ThemeToggle from '../ThemeToggle.svelte';
	/** Mobile menu open state */
	let mobileMenuOpen = false;
</script>

<header
	class="navbar bg-base-100/80 border-base-200 sticky top-0 z-50 border-b backdrop-blur-md"
	role="navigation"
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
			<div class="flex items-center space-x-8">
				<slot name="nav" {mobileMenuOpen} id="mobile-menu"></slot>
				<ThemeToggle />
				<button
					class="btn btn-ghost btn-square md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-menu"
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
