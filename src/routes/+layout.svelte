<script lang="ts">
	import '../app.css';
	export let data: { user: any };
</script>

<nav class="navbar">
	<a class="btn btn-ghost" href="/">Home</a>
	{#if !data.user}
		<a class="btn btn-ghost" href="/login">Log in</a>
		<a class="btn btn-ghost" href="/signup">Sign up</a>
	{:else}
		<a class="btn btn-ghost" href="/storyboard">Storyboard</a>
		<a class="btn btn-ghost" href="/user">User Settings</a>
		<form class="m-0 p-0" method="POST" action="/logout">
			<button class="btn btn-ghost">Log out</button>
		</form>
	{/if}
</nav>

<div class="bg-base-100 min-h-screen">
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>
