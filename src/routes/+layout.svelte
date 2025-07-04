<script lang="ts">
	import '../app.css'
	export let data: { user: any };
	console.log(data.user);
</script>

<nav class="navbar">
	<a class="btn btn-ghost" href="/">Home</a>
	{#if !data.user}
		<a class="btn btn-ghost" href="/login">Log in</a>
		<a class="btn btn-ghost" href="/signup">Sign up</a>
	{:else}
		<a class="btn btn-ghost" href="/storyboard">Storyboard</a>
		<form class="p-0 m-0 bg-red-600" method="POST" action="/logout">
			<button class="btn btn-ghost">Log out</button>
		</form>
	{/if}
</nav>

<main>
	<slot />
</main>
