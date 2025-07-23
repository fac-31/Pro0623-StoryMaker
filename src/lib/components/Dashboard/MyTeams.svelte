<script lang="ts">
	import { Plus, Users, MoreHorizontal, X } from 'lucide-svelte';
	import type { Team } from '$lib/models/team.model';
	import { enhance } from '$app/forms';

	interface Props {
		teams: Team[];
		onViewChange: (view: string, team?: Team | null) => void;
		selectedTeam?: Team | null;
	}

	let { teams, onViewChange, selectedTeam }: Props = $props();

	// Team management modals
	let showCreateTeamModal = $state(false);

	// function getRoleIcon(role: string) {
	// 	switch (role) {
	// 		case 'owner':
	// 			return Crown;
	// 		case 'admin':
	// 			return Shield;
	// 		case 'editor':
	// 			return Settings;
	// 		default:
	// 			return Eye;
	// 	}
	// }

	// function getRoleColor(role: string) {
	// 	switch (role) {
	// 		case 'owner':
	// 			return 'text-yellow-600 bg-yellow-100';
	// 		case 'admin':
	// 			return 'text-red-600 bg-red-100';
	// 		case 'editor':
	// 			return 'text-blue-600 bg-blue-100';
	// 		default:
	// 			return 'text-gray-600 bg-gray-100';
	// 	}
	// }

	function viewTeamStoryboards(team: Team | null) {
		selectedTeam = team;
		onViewChange('team-storyboards', team);
		console.log('Viewing storyboards for team:', selectedTeam);
	}
</script>

<section>
	<!-- Page Header -->
	<header class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-base-content text-3xl font-bold">My Teams</h1>
				<p class="text-base-content/70 mt-1">
					Collaborate with your team members on storyboard projects
				</p>
			</div>

			<div class="flex items-center space-x-3">
				<button class="btn btn-primary" onclick={() => (showCreateTeamModal = true)}>
					<Plus class="h-5 w-5" />
					<span>Create Team</span>
				</button>
			</div>
		</div>
	</header>

	<!-- Teams Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each teams as team (team._id)}
			<!-- {@const RoleIcon = getRoleIcon(team.role)} -->
			<div class="card bg-base-100 group shadow-xl transition-shadow hover:shadow-2xl">
				<div class="p-6">
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
							>
								<Users class="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 class="text-base-content font-semibold">{team.name}</h3>
							</div>
						</div>
						<button
							class="text-base-content/40 hover:text-base-content/60 p-1 transition-colors"
							aria-label="More options for {team.name}"
						>
							<MoreHorizontal class="h-4 w-4" />
						</button>
					</div>

					<div class="mb-4 flex items-center justify-between">
						<!-- <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getRoleColor(team.role)}">
							<RoleIcon class="mr-1 h-3 w-3" />
							{team.role}
						</span> -->

						<div class="text-base-content/50 flex items-center space-x-4 text-sm">
							<span>{team.users.length} member{team.users.length == 1 ? '' : 's'}</span>
							<span>{team.projects.length} storyboard{team.projects.length == 1 ? '' : 's'}</span>
						</div>
					</div>

					<div class="border-base-200 flex items-center space-x-2 border-t pt-4">
						<button class="btn btn-primary btn-sm flex-1" onclick={() => viewTeamStoryboards(team)}>
							View Storyboards
						</button>
						<!-- <button
							class="p-2 text-gray-400 transition-colors hover:text-purple-600"
							onclick={() => copyInviteCode(team.inviteCode)}
						>
							{#if copiedInviteCode}
								<Check class="h-4 w-4" />
							{:else}
								<Copy class="h-4 w-4" />
							{/if}
						</button> -->
						<!-- {#if team.role !== 'owner'}
							<button
								class="p-2 text-gray-400 transition-colors hover:text-red-600"
								onclick={() => leaveTeam(team.id)}
							>
								<LogOut class="h-4 w-4" />
							</button>
						{/if} -->
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Create Team Modal -->
{#if showCreateTeamModal}
	<dialog class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" open>
		<div class="bg-base-100 w-full max-w-md rounded-2xl p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 id="create-team-title" class="text-base-content text-xl font-semibold">
					Create New Team
				</h2>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (showCreateTeamModal = false)}
					aria-label="Close create team dialog"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				method="POST"
				action="?/createTeam"
				use:enhance={() => {
					// This callback runs after the action completes
					return async ({ update }) => {
						await update();
						showCreateTeamModal = false;
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="team-name" class="label">
						<span class="label-text">Team Name</span>
					</label>
					<input
						id="team-name"
						type="text"
						name="name"
						class="input input-bordered w-full"
						placeholder="Enter team name..."
						required
					/>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						class="btn btn-primary flex-1"
						onclick={() => (showCreateTeamModal = false)}
					>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary flex-1"> Create Team </button>
				</div>
			</form>
		</div>
	</dialog>
{/if}
