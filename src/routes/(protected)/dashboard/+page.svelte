<script lang="ts">
	const { data } = $props();

	const user = $derived(data.user);
	const storyboards = $derived(data.storyboards);
	const teams = $derived(data.teams);

	import Sidebar from '$lib/components/Dashboard/Sidebar.svelte';
	import MyStoryboards from '$lib/components/Dashboard/MyStoryboards.svelte';
	import MyTeams from '$lib/components/Dashboard/MyTeams.svelte';
	import type { Team } from '$lib/models/team.model.js';

	// State management
	let currentView = $state('my-storyboards'); // 'my-storyboards', 'teams', 'team-storyboards'
	let selectedTeam = $state<Team | null>(null);
	let sidebarCollapsed = $state(false);

	function handleViewChange(view: string, team?: Team | null) {
		currentView = view;
		if (team) {
			selectedTeam = team;
		} else {
			selectedTeam = null;
		}
	}

	function handleToggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<!-- Sidebar Component -->
	<Sidebar
		{user}
		{currentView}
		{sidebarCollapsed}
		onViewChange={handleViewChange}
		onToggleSidebar={handleToggleSidebar}
	/>

	<!-- Main Content -->
	<div class="flex-1 lg:ml-64">
		<!-- Mobile sidebar toggle -->
		<button
			class="fixed top-4 left-4 z-40 rounded-lg border border-gray-200/50 bg-white/80 p-2 backdrop-blur-sm lg:hidden"
			onclick={handleToggleSidebar}
			aria-label="Toggle sidebar"
		>
			<svg class="h-5 w-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>

		<main class="px-6 py-8">
			<!-- Render components based on currentView -->
			{#if currentView === 'my-storyboards'}
				<MyStoryboards {storyboards} />
			{:else if currentView === 'my-teams' || currentView === 'team-storyboards'}
				<MyTeams {teams} onViewChange={handleViewChange} {selectedTeam} />
				<!-- assumption: when user presses settings (currentView=="settings") 
			 we goto "\user" route from the navbar itself.
			 same with logout, we handle it in the sidebar component.	 
			 TODO: consider changing this in the future -->
			{/if}
		</main>
	</div>
</div>
