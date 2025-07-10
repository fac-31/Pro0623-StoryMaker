<script lang="ts">
	import { storyboardStore } from '$lib/stores/storyboard';
	//import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import StoryboardPage from '$lib/components/Storyboard/StoryboardPage.svelte';

	let storyboard = get(storyboardStore);
	storyboardStore.set(null);

	// Receive data from server load
	export let data: {
		userId: string;
	};

	let userId = data.userId;

	// Optionally listen for updates (e.g. in case this page stays alive between navigations)
	// onMount(() => {
	//   const unsubscribe = storyboardStore.subscribe(value => {
	//     storyboard = value;
	//   });
	//   return unsubscribe;
	// });
</script>

<StoryboardPage {storyboard} {userId} />
