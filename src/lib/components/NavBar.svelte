<script lang="ts">
import { Menu, X, Play } from 'lucide-svelte';
let mobileMenuOpen = $state(false);
type NavType = 'home' | 'auth' | 'dashboard';
const { type = 'home' }: {type?: NavType} = $props();
</script>

<header
		class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md"
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
                                <button class="p-2 md:hidden" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
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
