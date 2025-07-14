<script lang="ts">
	import '../app.css';
</script>

<div class="bg-base-100 min-h-screen">
	<header class="p-4 bg-base-200">
		<h1 class="text-xl font-bold">My App</h1>
	</header>
	<main class="container mx-auto p-4">
		<slot />
	</main>
	<footer class="p-4 bg-base-200 text-center">
		<p>&copy; 2023 My App</p>
	</footer>
</div>
