<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
</script>

<nav class="hidden items-center space-x-8 md:ml-8 md:flex" aria-label="Main navigation">
	<a href="#features" class="text-base-content/70 hover:text-primary transition-colors">Features</a>
	<a href="#how-it-works" class="text-base-content/70 hover:text-primary transition-colors"
		>How it Works</a
	>
	<a href="#testimonials" class="text-base-content/70 hover:text-primary transition-colors"
		>Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a href="/login" class="btn btn-ghost">Sign In</a>
	<a href="/signup" class="btn btn-primary"> Start Creating </a>
</div>

<!-- Mobile Navigation -->
{#if mobileMenuOpen}
	<div
		class="border-base-300 bg-base-100 border-t md:hidden"
		aria-labelledby="mobile-navigation-title"
	>
		<h2 id="mobile-navigation-title" class="sr-only">Mobile navigation</h2>
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
