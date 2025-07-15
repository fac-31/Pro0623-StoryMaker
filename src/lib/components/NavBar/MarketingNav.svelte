<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
</script>

<nav class="hidden items-center space-x-8 md:flex md:ml-8">
	<a href="#features" class="text-base-content/70 transition-colors hover:text-primary">Features</a>
	<a href="#how-it-works" class="text-base-content/70 transition-colors hover:text-primary"
		>How it Works</a
	>
	<a href="#testimonials" class="text-base-content/70 transition-colors hover:text-primary"
		>Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a href="/login" class="btn btn-ghost">Sign In</a>
	<a
		href="/signup"
		class="btn btn-primary"
	>
		Start Creating
	</a>
</div>

<!-- Mobile Navigation -->
{#if mobileMenuOpen}
	<div class="border-t border-gray-200 bg-white md:hidden">
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
