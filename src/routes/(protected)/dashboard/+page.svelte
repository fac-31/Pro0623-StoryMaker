<script lang="ts">
	const { data } = $props();

	const supabase = $derived(data.supabase);
	const user = $derived(data.user);
	const users = $derived(data.users);
	const teams = $derived(data.teams);
	const storyboards = $derived(data.storyboards);

	import Sidebar from '$lib/components/Dashboard/Sidebar.svelte';
	import Storyboards from '$lib/components/Dashboard/Storyboards.svelte';
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

<div class="bg-base-200 flex min-h-screen">
	<!-- Sidebar Component -->
	<Sidebar
		{supabase}
		{currentView}
		{sidebarCollapsed}
		onViewChange={handleViewChange}
		onToggleSidebar={handleToggleSidebar}
	/>

	<!-- Main Content -->
	<div class="flex-1 lg:ml-64">
		<!-- Mobile sidebar toggle -->
		<button
			class="border-base-300/50 bg-base-100/80 fixed top-4 left-4 z-40 rounded-lg border p-2 backdrop-blur-sm lg:hidden"
			onclick={handleToggleSidebar}
			aria-label="Toggle sidebar"
		>
			<svg
				class="text-base-content/60 h-5 w-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
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
				<Storyboards {storyboards} list={user.projects} {user} />
			{:else if currentView === 'team-storyboards' && selectedTeam}
				<Storyboards {storyboards} list={selectedTeam.projects} {user} team={selectedTeam} {users} />
			{:else if currentView === 'my-teams'}
				<MyTeams {teams} onViewChange={handleViewChange} {selectedTeam} />
				<!-- assumption: when user presses settings (currentView=="settings") 
			 we goto "\user" route from the navbar itself.
			 same with logout, we handle it in the sidebar component.	 
			 TODO: consider changing this in the future -->
			{/if}
		</main>
	</div>
</div>
