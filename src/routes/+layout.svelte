<script lang="ts">
	import '../app.css';
</script>

<div class="bg-base-100 min-h-screen">
	<!-- Skip Links -->
	<a
		href="#main-content"
		class="focus:bg-primary focus:text-primary-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
	>
		Skip to main content
	</a>

	<header>
		<!-- Add header content here -->
	</header>

	<main id="main-content" class="container mx-auto">
		<slot />
	</main>

	<footer>
		<!-- Add footer content here -->
	</footer>
</div>
