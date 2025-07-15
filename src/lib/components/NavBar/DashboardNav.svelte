<script lang="ts">
	import { Settings, Bell, LogOut } from 'lucide-svelte';
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	export let user;
</script>

<div class="px-6 py-4">
	<div class="flex items-center space-x-4">
		<button class="btn btn-ghost btn-sm">
			<Bell class="h-5 w-5" />
		</button>
		<a href="/user" class="btn btn-ghost btn-sm">
			<Settings class="h-5 w-5" />
		</a>
		<div class="flex items-center space-x-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
			>
				<span class="text-sm font-medium text-white">{user.user_metadata.display_name[0]}</span>
			</div>
			<span class="hidden text-sm font-medium text-base-content md:block"
				>{user.user_metadata.display_name}</span
			>
		</div>
		<form action="/logout" method="POST" class="">
			<button type="submit" class="btn btn-ghost btn-sm">
				<LogOut class="h-5 w-5" />
			</button>
		</form>
	</div>
</div>
{#if mobileMenuOpen}
	<div class="border-t border-base-200 bg-base-100 md:hidden">
		<div class="space-y-4 px-4 py-4">
			<a href="#features" class="block text-base-content/70 hover:text-primary">Features</a>
			<a href="#how-it-works" class="block text-base-content/70 hover:text-primary">How it Works</a>
			<a href="#testimonials" class="block text-base-content/70 hover:text-primary">Testimonials</a>
			<div class="space-y-2 border-t border-base-200 pt-4">
				<a href="/login" class="block w-full text-left text-base-content/70">Sign In</a>
				<a
					href="/signup"
					class="btn btn-primary w-full"
				>
					Start Creating
				</a>
			</div>
		</div>
	</div>
{/if}
