<script lang="ts">
	import { Settings, Bell, LogOut } from 'lucide-svelte';
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	export let user;
</script>

<div class="px-6 py-4">
	<div class="flex items-center space-x-4">
		<button class="p-2 text-gray-400 transition-colors hover:text-gray-600 motion-reduce:transition-none">
			<Bell class="h-5 w-5" />
		</button>
		<a href="/user" class="p-2 text-gray-400 transition-colors hover:text-gray-600 motion-reduce:transition-none">
			<Settings class="h-5 w-5" />
		</a>
		<div class="flex items-center space-x-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
			>
				<span class="text-sm font-medium text-white">{user.user_metadata.display_name[0]}</span>
			</div>
			<span class="hidden text-sm font-medium text-gray-700 md:block"
				>{user.user_metadata.display_name}</span
			>
		</div>
		<form action="/logout" method="POST" class="">
			<button type="submit" class="p-2 text-gray-400 transition-colors hover:text-gray-600 motion-reduce:transition-none">
				<LogOut class="h-5 w-5" />
			</button>
		</form>
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
