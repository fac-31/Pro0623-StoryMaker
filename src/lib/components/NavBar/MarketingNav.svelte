<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	/** Callback to close the mobile menu */
	export let closeMobileMenu: () => void = () => {};
</script>

<nav class="hidden items-center space-x-8 md:ml-8 md:flex" aria-label="Main navigation">
	<a
		href="#features"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="Features section">Features</a
	>
	<a
		href="#how-it-works"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="How it works section">How it Works</a
	>
	<a
		href="#testimonials"
		class="text-base-content/70 hover:text-primary transition-colors"
		aria-label="Testimonials section">Testimonials</a
	>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a href="/login" class="btn btn-ghost min-h-[44px]" aria-label="Sign in to your account"
		>Sign In</a
	>
	<a href="/signup" class="btn btn-primary min-h-[44px]" aria-label="Start creating a new account"
		>Start Creating</a
	>
</div>

<!-- Mobile Navigation -->
<nav
	class="border-base-300 bg-base-100 border-t md:hidden"
	class:hidden={!mobileMenuOpen}
	aria-label="Mobile navigation"
>
	<div class="space-y-4 px-4 py-4">
		<a
			href="#features"
			class="text-base-content/70 hover:text-primary block"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="Features section">Features</a
		>
		<a
			href="#how-it-works"
			class="text-base-content/70 hover:text-primary block"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="How it works section">How it Works</a
		>
		<a
			href="#testimonials"
			class="text-base-content/70 hover:text-primary block"
			on:click={() => setTimeout(() => closeMobileMenu(), 100)}
			aria-label="Testimonials section">Testimonials</a
		>
		<div class="border-base-200 space-y-2 border-t pt-4">
			<a
				href="/login"
				class="text-base-content/70 block w-full text-left"
				aria-label="Sign in to your account">Sign In</a
			>
			<a
				href="/signup"
				class="btn btn-primary min-h-[44px] w-full"
				aria-label="Start creating a new account">Start Creating</a
			>
		</div>
	</div>
</nav>
