<script lang="ts">
	import { 
		Plus, 
		UserPlus, 
		Users, 
		MoreHorizontal, 
		Crown, 
		Shield, 
		Settings, 
		Eye, 
		Copy, 
		Check, 
		LogOut, 
		X,
		ChevronRight
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

    interface Props {
        onViewChange: (view: string, team?: any) => void;
        currentView?: string;
        selectedTeam?: any;
    }

let { onViewChange, currentView, selectedTeam }: Props = $props();

	// Team management modals
	let showCreateTeamModal = $state(false);
	let showJoinTeamModal = $state(false);
	
	// Form states
	let newTeam = $state({ name: '' });
	let joinTeamCode = $state('');
	let copiedInviteCode = $state(false);

	// Mock team data (replace with actual data)
	let userTeams = $state([
		{
			id: 1,
			name: 'Creative Agency',
			description: 'Our main creative team',
			role: 'owner',
			members: 8,
			inviteCode: 'CREA-2024-XYZ',
			storyboards: 12
		},
		{
			id: 2,
			name: 'Marketing Team',
			description: 'Marketing campaigns and content',
			role: 'editor',
			members: 5,
			inviteCode: 'MARK-2024-ABC',
			storyboards: 7
		}
	]);

	// Error state
	let error: string | null = null;

	// Functions
	async function createTeam() {

		try {
			const res = await fetch('/api/teams/create', {
				method: 'POST',
				body: JSON.stringify(newTeam)
			});
			const data = await res.json();
			if (res.ok) {
				const id = data.insertedId;
				console.log('Team created with ID:', id);
			} else {
				error = data.error || 'Failed to create a team';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}


		// Reset form
		newTeam = { name: ''};
		showCreateTeamModal = false;
		
	}

	function joinTeam() {
		if (joinTeamCode.trim()) {
			const team = {
				id: Date.now(),
				name: 'Joined Team',
				description: 'Team joined via invite code',
				role: 'viewer',
				members: 12,
				inviteCode: joinTeamCode,
				storyboards: 5
			};
			
			userTeams.push(team);
			joinTeamCode = '';
			showJoinTeamModal = false;
		}
	}

	function leaveTeam(teamId: number) {
		userTeams = userTeams.filter(team => team.id !== teamId);
	}

	function copyInviteCode(code: string) {
		navigator.clipboard.writeText(code);
		copiedInviteCode = true;
		setTimeout(() => copiedInviteCode = false, 2000);
	}

	function getRoleIcon(role: string) {
		switch (role) {
			case 'owner': return Crown;
			case 'admin': return Shield;
			case 'editor': return Settings;
			default: return Eye;
		}
	}

	function getRoleColor(role: string) {
		switch (role) {
			case 'owner': return 'text-yellow-600 bg-yellow-100';
			case 'admin': return 'text-red-600 bg-red-100';
			case 'editor': return 'text-blue-600 bg-blue-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	function viewTeamStoryboards(team: any) {
		onViewChange('team-storyboards', team);
	}
</script>

<div>
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Teams</h1>
				<p class="text-gray-600 mt-1">Collaborate with your team members on storyboard projects</p>
			</div>

			<div class="flex items-center space-x-3">
				<button
					class="flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
					onclick={() => showJoinTeamModal = true}
				>
					<UserPlus class="h-5 w-5" />
					<span>Join Team</span>
				</button>
				<button
					class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
					onclick={() => showCreateTeamModal = true}
				>
					<Plus class="h-5 w-5" />
					<span>Create Team</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Teams Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each userTeams as team (team.id)}
			{@const RoleIcon = getRoleIcon(team.role)}
			<div class="group rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-xl">
				<div class="p-6">
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center space-x-3">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
								<Users class="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 class="font-semibold text-gray-900">{team.name}</h3>
								<p class="text-sm text-gray-600">{team.description}</p>
							</div>
						</div>
						<button class="p-1 text-gray-400 transition-colors hover:text-gray-600">
							<MoreHorizontal class="h-4 w-4" />
						</button>
					</div>

					<div class="mb-4 flex items-center justify-between">
						<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getRoleColor(team.role)}">
							<RoleIcon class="mr-1 h-3 w-3" />
							{team.role}
						</span>
						<div class="flex items-center space-x-4 text-sm text-gray-500">
							<span>{team.members} members</span>
							<span>{team.storyboards} storyboards</span>
						</div>
					</div>

					<div class="flex items-center space-x-2 border-t border-gray-100 pt-4">
						<button
							class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700"
							onclick={() => viewTeamStoryboards(team)}
						>
							View Storyboards
						</button>
						<button
							class="p-2 text-gray-400 transition-colors hover:text-purple-600"
							onclick={() => copyInviteCode(team.inviteCode)}
						>
							{#if copiedInviteCode}
								<Check class="h-4 w-4" />
							{:else}
								<Copy class="h-4 w-4" />
							{/if}
						</button>
						{#if team.role !== 'owner'}
							<button
								class="p-2 text-gray-400 transition-colors hover:text-red-600"
								onclick={() => leaveTeam(team.id)}
							>
								<LogOut class="h-4 w-4" />
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Create Team Modal -->
{#if showCreateTeamModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-2xl bg-white p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900">Create New Team</h2>
				<button
					class="p-2 text-gray-400 transition-colors hover:text-gray-600"
					onclick={() => showCreateTeamModal = false}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); createTeam(); }} class="space-y-4">
				<div>
					<label for="team-name" class="mb-2 block text-sm font-medium text-gray-700">Team Name</label>
					<input
						id="team-name"
						type="text"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
						placeholder="Enter team name..."
						bind:value={newTeam.name}
						required
					/>
				</div>

				

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
						onclick={() => showCreateTeamModal = false}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
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
				<h2 class="text-xl font-semibold text-gray-900">Join Team</h2>
				<button
					class="p-2 text-gray-400 transition-colors hover:text-gray-600"
					onclick={() => showJoinTeamModal = false}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); joinTeam(); }} class="space-y-4">
				<div>
					<label for="team-invite-code" class="mb-2 block text-sm font-medium text-gray-700">Team Invite Code</label>
					<input
						id="team-invite-code"
						type="text"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
						placeholder="Enter invite code..."
						bind:value={joinTeamCode}
						required
					/>
					<p class="mt-2 text-sm text-gray-500">Ask your team leader for the invite code</p>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
						onclick={() => showJoinTeamModal = false}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
					>
						Join Team
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}