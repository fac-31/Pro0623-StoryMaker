<script lang="ts">
	import { Settings, Bell, LogOut } from 'lucide-svelte';
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	export let user;
</script>

<div class="px-6 py-4">
	<div class="flex items-center space-x-4">
		<button class="btn btn-ghost btn-sm" aria-label="View notifications">
			<Bell class="h-5 w-5" />
			<span class="sr-only">View notifications</span>
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
			<span class="text-base-content hidden text-sm font-medium md:block"
				>{user.user_metadata.display_name}</span
			>
		</div>
		<form action="/logout" method="POST" class="">
			<button type="submit" class="btn btn-ghost btn-sm" aria-label="Sign out">
				<LogOut class="h-5 w-5" />
				<span class="sr-only">Sign out</span>
			</button>
		</form>
	</div>
</div>
{#if mobileMenuOpen}
	<div class="border-base-200 bg-base-100 border-t md:hidden">
		<div class="space-y-4 px-4 py-4">
			<a href="#features" class="text-base-content/70 hover:text-primary block">Features</a>
			<a href="#how-it-works" class="text-base-content/70 hover:text-primary block">How it Works</a>
			<a href="#testimonials" class="text-base-content/70 hover:text-primary block">Testimonials</a>
			<div class="border-base-200 space-y-2 border-t pt-4">
				<a href="/login" class="text-base-content/70 block w-full text-left">Sign In</a>
				<a href="/signup" class="btn btn-primary w-full"> Start Creating </a>
			</div>
		</div>
	</div>
{/if}
