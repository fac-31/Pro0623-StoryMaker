<script lang="ts">
	import '../app.css';
	export let data: { user: any };
</script>

<div class="bg-base-100 min-h-screen">
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>
