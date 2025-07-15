<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
</script>

<nav class="hidden items-center space-x-8 md:flex">
	<a
		href="#features"
		class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
		>Features</a
	>
	<a
		href="#how-it-works"
		class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
		>How it Works</a
	>
	<a
		href="#testimonials"
		class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
		>Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a
		href="/login"
		class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
		>Sign In</a
	>
	<a
		href="/signup"
		class="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transition-none"
	>
		Start Creating
	</a>
</div>

<!-- Mobile Navigation -->
{#if mobileMenuOpen}
	<div class="border-t border-gray-200 bg-white md:hidden">
		<div class="space-y-4 px-4 py-4">
			<a
				href="#features"
				class="block text-gray-600 hover:text-purple-600 motion-reduce:transition-none"
				>Features</a
			>
			<a
				href="#how-it-works"
				class="block text-gray-600 hover:text-purple-600 motion-reduce:transition-none"
				>How it Works</a
			>
			<a
				href="#testimonials"
				class="block text-gray-600 hover:text-purple-600 motion-reduce:transition-none"
				>Testimonials</a
			>
			<div class="space-y-2 border-t border-gray-200 pt-4">
				<a
					href="/login"
					class="block w-full text-left text-gray-600 motion-reduce:transition-none">Sign In</a
				>
				<a
					href="/signup"
					class="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-center text-white motion-reduce:transition-none"
				>
					Start Creating
				</a>
			</div>
		</div>
	</div>
{/if}
