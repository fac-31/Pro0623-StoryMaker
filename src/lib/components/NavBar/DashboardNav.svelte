<script lang="ts">
	import { Settings, Bell, LogOut } from 'lucide-svelte';
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
</script>

<div class="px-6 py-4">
	<div class="flex items-center justify-between">
		<nav class="ml-8 hidden items-center space-x-6 md:flex">
			<a href="/dashboard" class="font-medium text-purple-600">Dashboard</a>
			<a href="/storyboard" class="text-gray-600 transition-colors hover:text-purple-600"
				>Create Storyboard</a
			>
			<a href="/library" class="text-gray-600 transition-colors hover:text-purple-600">Library</a>
		</nav>
	</div>

	<div class="flex items-center space-x-4">
		<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
			<Bell class="h-5 w-5" />
		</button>
		<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
			<Settings class="h-5 w-5" />
		</button>
		<div class="flex items-center space-x-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
			>
				<span class="text-sm font-medium text-white">JD</span>
			</div>
			<span class="hidden text-sm font-medium text-gray-700 md:block">David Ogden</span>
		</div>
		<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
			<LogOut class="h-5 w-5" />
		</button>
	</div>
</div>
{#if mobileMenuOpen}
	<div class="border-t border-gray-200 bg-white md:hidden">
		<div class="space-y-4 px-4 py-4">
			<a href="#features" class="block text-gray-600 hover:text-purple-600">Features</a>
			<a href="#how-it-works" class="block text-gray-600 hover:text-purple-600">How it Works</a>
			<a href="#testimonials" class="block text-gray-600 hover:text-purple-600">Testimonials</a>
			<div class="space-y-2 border-t border-gray-200 pt-4">
				<a href="/login" class="block w-full text-left text-gray-600">Sign In</a>
				<a
					href="/signup"
					class="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-center text-white"
				>
					Start Creating
				</a>
			</div>
		</div>
	</div>
{/if}
