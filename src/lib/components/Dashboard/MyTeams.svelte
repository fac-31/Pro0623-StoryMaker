<script lang="ts">
	import { Plus, UserPlus, Users, MoreHorizontal, X } from 'lucide-svelte';
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
	let showJoinTeamModal = $state(false);

	// Form states
	// let newTeam = $state({ name: '' });
	let joinTeamCode = $state('');
	// let copiedInviteCode = $state(false);

	function joinTeam() {
		if (joinTeamCode.trim()) {
			// const team = {
			// 	id: Date.now(),
			// 	name: 'Joined Team',
			// 	description: 'Team joined via invite code',
			// 	role: 'viewer',
			// 	members: 12,
			// 	inviteCode: joinTeamCode,
			// 	storyboards: 5
			// };

			//userTeams.push(team);
			joinTeamCode = '';
			showJoinTeamModal = false;
		}
	}

	// function leaveTeam(teamId: number) {
	// 	//userTeams = userTeams.filter(team => team.id !== teamId);
	// }

	// function copyInviteCode(code: string) {
	// 	navigator.clipboard.writeText(code);
	// 	copiedInviteCode = true;
	// 	setTimeout(() => (copiedInviteCode = false), 2000);
	// }

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

<div>
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-3xl font-bold text-base-content">My Teams</h1>
				<p class="mt-1 text-base-content/70">Collaborate with your team members on storyboard projects</p>
			</div>

			<div class="flex items-center space-x-3">
				<button
					class="btn btn-outline"
					onclick={() => (showJoinTeamModal = true)}
				>
					<UserPlus class="h-5 w-5" />
					<span>Join Team</span>
				</button>
				<button
					class="btn btn-primary"
					onclick={() => (showCreateTeamModal = true)}
				>
					<Plus class="h-5 w-5" />
					<span>Create Team</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Teams Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each teams as team (team._id)}
			<!-- {@const RoleIcon = getRoleIcon(team.role)} -->
			<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow group"
			>
				<div class="p-6">
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
							>
								<Users class="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 class="font-semibold text-base-content">{team.name}</h3>
							</div>
						</div>
						<button class="p-1 text-base-content/40 transition-colors hover:text-base-content/60">
							<MoreHorizontal class="h-4 w-4" />
						</button>
					</div>

					<div class="mb-4 flex items-center justify-between">
						<!-- <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getRoleColor(team.role)}">
							<RoleIcon class="mr-1 h-3 w-3" />
							{team.role}
						</span> -->

						<div class="flex items-center space-x-4 text-sm text-base-content/50">
							<span>{team.users} members</span>
							<span>{team.projects} storyboards</span>
						</div>
					</div>

					<div class="flex items-center space-x-2 border-t border-base-200 pt-4">
						<button
							class="btn btn-primary btn-sm flex-1"
							onclick={() => viewTeamStoryboards(team)}
						>
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
</div>

<!-- Create Team Modal -->{#if showCreateTeamModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-2xl bg-white p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-base-content">Create New Team</h2>
				<button class="btn btn-ghost btn-sm" onclick={() => (showCreateTeamModal = false)}>
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
						class="btn btn-outline flex-1"
						onclick={() => (showCreateTeamModal = false)}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="btn btn-primary flex-1"
					>
						Create Team
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Join Team Modal -->
{#if showJoinTeamModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-2xl bg-white p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-base-content">Join Team</h2>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (showJoinTeamModal = false)}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					joinTeam();
				}}
				class="space-y-4"
			>
				<div>
					<label for="team-invite-code" class="label">
						<span class="label-text">Team Invite Code</span>
					</label>
					<input
						id="team-invite-code"
						type="text"
						class="input input-bordered w-full"
						placeholder="Enter invite code..."
						bind:value={joinTeamCode}
						required
					/>
					<p class="mt-2 text-sm text-base-content/50">Ask your team leader for the invite code</p>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						class="btn btn-outline flex-1"
						onclick={() => (showJoinTeamModal = false)}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="btn btn-primary flex-1"
					>
						Join Team
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
