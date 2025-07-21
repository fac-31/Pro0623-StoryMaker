<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
</script>

<nav class="hidden items-center space-x-8 md:ml-8 md:flex">
	<a
		href="#features"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="Learn more about our features">Features</a
	>
	<a
		href="#how-it-works"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="Understand how our product works">How it Works</a
	>
	<a
		href="#testimonials"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="Read testimonials from our customers">Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a href="/login" class="btn btn-ghost" aria-label="Sign in to your account">Sign In</a>
	<a
		href="/signup"
		class="btn btn-primary"
		aria-label="Sign up and start creating your storyboard">Start Creating</a
	>
</div>

<!-- Mobile Navigation -->
{#if mobileMenuOpen}
	<nav class="border-base-300 bg-base-100 border-t md:hidden">
		<div class="space-y-4 px-4 py-4">
			<a
				href="#features"
				class="text-base-content/70 hover:text-primary block"
				on:click={() => setTimeout(() => (mobileMenuOpen = false), 100)}
				aria-label="Learn more about our features">Features</a
			>
			<a
				href="#how-it-works"
				class="text-base-content/70 hover:text-primary block"
				on:click={() => setTimeout(() => (mobileMenuOpen = false), 100)}
				aria-label="Understand how our product works">How it Works</a
			>
			<a
				href="#testimonials"
				class="text-base-content/70 hover:text-primary block"
				on:click={() => setTimeout(() => (mobileMenuOpen = false), 100)}
				aria-label="Read testimonials from our customers">Testimonials</a
			>
			<div class="border-base-200 space-y-2 border-t pt-4">
				<a
					href="/login"
					class="text-base-content/70 block w-full text-left"
					aria-label="Sign in to your account">Sign In</a
				>
				<a
					href="/signup"
					class="btn btn-primary w-full"
					aria-label="Sign up and start creating your storyboard">Start Creating</a
				>
			</div>
		</div>
	</nav>
{/if}
