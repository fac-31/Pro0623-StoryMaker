<script lang="ts">
	export let data: { user: any };
	console.log(data.user);
</script>

<nav>
	<a href="/">Home</a>
	{#if !data.user}
		<a href="/login">Log in</a>
		<a href="/signup">Sign up</a>
	{:else}
		<a href="/storyboard">Storyboard</a>
		<form method="POST" action="/logout">
			<button>Log out</button>
		</form>
	{/if}
</nav>

<main>
	<slot />
</main>
