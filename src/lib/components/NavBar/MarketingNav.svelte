<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	/** Callback to close the mobile menu */
	export let closeMobileMenu: () => void = () => {};
</script>

<nav class="hidden items-center space-x-8 md:ml-8 md:flex" role="navigation" aria-label="Main">
	<a
		href="#features"
		class="text-base-content/70 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-colors"
		aria-label="Go to Features Section">Features</a
	>
	<a
		href="#how-it-works"
		class="text-base-content/70 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-colors"
		aria-label="Go to How it Works Section">How it Works</a
	>
	<a
		href="#testimonials"
		class="text-base-content/70 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-colors"
		aria-label="Go to Testimonials Section">Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a
		href="/login"
		class="btn btn-ghost min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
		aria-label="Sign In to your account">Sign In</a
	>
	<a
		href="/signup"
		class="btn btn-primary min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
		aria-label="Start Creating for free">
		Start Creating
	</a>
</div>

<!-- Mobile Navigation -->
<nav
	class="border-base-300 bg-base-100 border-t md:hidden"
	class:hidden={!mobileMenuOpen}
	role="navigation"
	aria-label="Mobile"
>
	<div class="space-y-4 px-4 py-4">
		<a
			href="#features"
			class="text-base-content/70 hover:text-primary block focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="Go to Features Section">Features</a
		>
		<a
			href="#how-it-works"
			class="text-base-content/70 hover:text-primary block focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="Go to How it Works Section">How it Works</a
		>
		<a
			href="#testimonials"
			class="text-base-content/70 hover:text-primary block focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="Go to Testimonials Section">Testimonials</a
		>
		<div class="border-base-200 space-y-2 border-t pt-4">
			<a
				href="/login"
				class="text-base-content/70 block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
				aria-label="Sign In to your account">Sign In</a
			>
			<a
				href="/signup"
				class="btn btn-primary min-h-[44px] w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
				aria-label="Start Creating for free">
				Start Creating
			</a>
		</div>
	</div>
</nav>
