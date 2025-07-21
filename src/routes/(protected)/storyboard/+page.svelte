<script lang="ts">
	import { storyboardStore } from '$lib/stores/storyboard';
	import { teamStore } from '$lib/stores/team';
	//import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import StoryboardPage from '$lib/components/Storyboard/StoryboardPage.svelte';

	let storyboard = get(storyboardStore);
	storyboardStore.set(null);

	let team = get(teamStore);
	teamStore.set(null);

	// Optionally listen for updates (e.g. in case this page stays alive between navigations)
	// onMount(() => {
	//   const unsubscribe = storyboardStore.subscribe(value => {
	//     storyboard = value;
	//   });
	//   return unsubscribe;
	// });
</script>

<h1>Create Storyboard</h1>
<StoryboardPage {storyboard} {team} />
