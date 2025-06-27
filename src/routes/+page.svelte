<script lang="ts">
	let prompt = '';
	let result = '';
	let loading = false;
	let error = '';

	async function submitPrompt() {
		loading = true;
		error = '';
		result = '';
		try {
			const res = await fetch('/langchain-agent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});
			if (!res.ok) throw new Error('Server error');
			const data = await res.json();
			result =
				typeof data.output === 'object'
					? JSON.stringify(data.output, null, 2)
					: data.output || JSON.stringify(data);
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = String(err);
			}
		} finally {
			loading = false;
		}
	}
</script>

<h1>Welcome to SvelteKit!</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form on:submit|preventDefault={submitPrompt}>
	<input
		type="text"
		bind:value={prompt}
		placeholder="Enter your prompt"
		required
		style="width: 300px;"
	/>
	<button type="submit" disabled={loading}>Ask</button>
</form>

{#if loading}
	<p>Loading...</p>
{/if}

{#if result}
	<h3>Result:</h3>
	<pre>{result}</pre>
{/if}

{#if error}
	<p style="color: red;">{error}</p>
{/if}
