<script lang="ts">
	import { Plus, Users, ChevronRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { Team } from '$lib/models/team.model';
	interface Props {
		selectedTeam: Team;
		onViewChange: (view: string) => void;
	}

	let { selectedTeam, onViewChange }: Props = $props();

	function handleNewStoryboard() {
		goto('/storyboard');
	}

	function handleBackToTeams() {
		onViewChange('teams');
	}
</script>

<div>
	<!-- Breadcrumb and Header -->
	<div class="mb-8">
		<div class="mb-4 flex items-center space-x-2">
			<button
				class="text-base-content/70 hover:text-base-content flex items-center space-x-2"
				onclick={handleBackToTeams}
			>
				<span>Teams</span>
				<ChevronRight class="h-4 w-4" />
			</button>
			<span class="text-base-content font-medium">{selectedTeam.name}</span>
		</div>

		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-base-content text-3xl font-bold">{selectedTeam.name} Storyboards</h1>
				<p class="text-base-content/70 mt-1">Collaborative storyboard projects for your team</p>
			</div>

			<button
				class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
				onclick={handleNewStoryboard}
			>
				<Plus class="h-5 w-5" />
				<span>New Team Storyboard</span>
			</button>
		</div>
	</div>

	<!-- Empty State -->
	<div class="py-12 text-center">
		<div class="bg-base-200 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
			<Users class="text-base-content/40 h-8 w-8" />
		</div>
		<h3 class="text-base-content mb-2 text-lg font-medium">No team storyboards yet</h3>
		<p class="text-base-content/50 mb-6">Start creating collaborative storyboards with your team</p>
		<button class="btn btn-primary" onclick={handleNewStoryboard}> Create First Storyboard </button>
	</div>
</div>
