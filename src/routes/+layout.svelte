<script lang="ts">
	import '../app.css';
</script>

<div class="bg-base-100 min-h-screen">
	<!-- Skip Links -->
	<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-content focus:px-4 focus:py-2 focus:rounded">
		Skip to main content
	</a>
	
	<main id="main-content" class="container mx-auto">
		<slot />
	</main>
</div>
