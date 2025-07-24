<script lang="ts">
	/** Is the mobile menu drawer open? */
	export let mobileMenuOpen: boolean = false;
	/** Callback to close the mobile menu */
	export let closeMobileMenu: () => void = () => {};
</script>

<nav class="hidden items-center space-x-8 md:ml-8 md:flex">
	<ul role="menu" class="flex items-center space-x-8">
		<li role="menuitem">
			<a href="#features" class="text-base-content/70 hover:text-primary transition-colors"
				>Features</a
			>
		</li>
		<li role="menuitem">
			<a href="#how-it-works" class="text-base-content/70 hover:text-primary transition-colors"
				>How it Works</a
			>
		</li>
		<li role="menuitem">
			<a href="#testimonials" class="text-base-content/70 hover:text-primary transition-colors"
				>Testimonials</a
			>
		</li>
	</ul>
</nav>

<div class="hidden items-center space-x-4 md:flex">
	<a href="/login" class="btn btn-ghost min-h-[44px]">Sign In</a>
	<a href="/signup" class="btn btn-primary min-h-[44px]"> Start Creating </a>
</div>

<!-- Mobile Navigation -->
<nav class="border-base-300 bg-base-100 border-t md:hidden" class:hidden={!mobileMenuOpen}>
	<div class="space-y-4 px-4 py-4">
		<ul role="menu">
			<li role="menuitem">
				<a
					href="#features"
					class="text-base-content/70 hover:text-primary block"
					on:click={() => setTimeout(() => closeMobileMenu(), 100)}>Features</a
				>
			</li>
			<li role="menuitem">
				<a
					href="#how-it-works"
					class="text-base-content/70 hover:text-primary block"
					on:click={() => setTimeout(() => closeMobileMenu(), 100)}>How it Works</a
				>
			</li>
			<li role="menuitem">
				<a
					href="#testimonials"
					class="text-base-content/70 hover:text-primary block"
					on:click={() => setTimeout(() => closeMobileMenu(), 100)}>Testimonials</a
				>
			</li>
		</ul>
		<div class="border-base-200 space-y-2 border-t pt-4">
			<a href="/login" class="text-base-content/70 block w-full text-left">Sign In</a>
			<a href="/signup" class="btn btn-primary min-h-[44px] w-full"> Start Creating </a>
		</div>
	</div>
</nav>
