<script lang="ts">
	const { data } = $props();
	const { user, storyboards } = data;

	import type { Storyboard } from '$lib/models/storyboard.model';
	import { storyboardStore } from '$lib/stores/storyboard';
	import {
		Bell,
		Plus,
		Search,
		MoreHorizontal,
		Play,
		UserPlus,
		Grid3X3,
		List,
		Video,
		Users,
		Settings,
		Home,
		LogOut,
		Crown,
		Shield,
		Eye,
		Copy,
		Check,
		X,
		Mail,
		ChevronRight,
		ChevronDown
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// State management
	let selectedStoryboard = $state<Storyboard | null>(null);
	let viewMode = $state('grid');
	let searchQuery = $state('');
	let currentView = $state('my-storyboards'); // 'my-storyboards', 'teams', 'team-storyboards'
	let selectedTeam = $state<any>(null);
	let sidebarCollapsed = $state(false);
	
	// Team management modals
	let showCreateTeamModal = $state(false);
	let showJoinTeamModal = $state(false);
	let showTeamSettingsModal = $state(false);
	let showInviteMemberModal = $state(false);
	
	// Form states
	let newTeam = $state({ name: '', description: '' });
	let joinTeamCode = $state('');
	let inviteEmail = $state('');
	let inviteRole = $state('viewer');
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

	console.log('Storyboards:', storyboards);

	// Navigation items
	const navItems = [
		{ id: 'my-storyboards', label: 'My Storyboards', icon: Home },
		{ id: 'teams', label: 'Teams', icon: Users },
		{ id: 'settings', label: 'Settings', icon: Settings },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'logout', label: 'Logout', icon: LogOut }];


	// Role definitions
	const roles = [
		{ value: 'viewer', label: 'Viewer', icon: Eye },
		{ value: 'editor', label: 'Editor', icon: Settings },
		{ value: 'admin', label: 'Admin', icon: Shield }
	];

	// Computed values
	const filteredProjects = () => {
		let projectsToFilter = storyboards;
		
		// If viewing team storyboards, filter by team
		if (currentView === 'team-storyboards' && selectedTeam) {
			projectsToFilter = selectedTeam.storyboards || [];
		}
		
		return projectsToFilter.filter((storyboard) => {
			const matchesSearch =
				storyboard.prompts.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
				storyboard.storyOutline.storyMetadata.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
			return matchesSearch;
		});
	};

	// Functions
	function createTeam() {
		if (newTeam.name.trim()) {
			const team = {
				id: Date.now(),
				name: newTeam.name,
				description: newTeam.description,
				role: 'owner',
				members: 1,
				inviteCode: `${newTeam.name.substring(0, 4).toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
				storyboards: 0
			};
			
			userTeams.push(team);
			newTeam = { name: '', description: '' };
			showCreateTeamModal = false;
		}
	}

	function joinTeam() {
		if (joinTeamCode.trim()) {
			// Mock join team logic
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
		selectedTeam = team;
		currentView = 'team-storyboards';
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<!-- Sidebar -->
	<aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 transition-transform duration-300 {sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0">
		<div class="flex h-full flex-col">
			<!-- Sidebar Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200/50">
				<div class="flex items-center space-x-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
						<Play class="h-5 w-5 text-white" />
					</div>
					<span class="font-semibold text-gray-900">Story Maker</span>
				</div>
				<button
					class="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
					onclick={() => sidebarCollapsed = !sidebarCollapsed}
				>
					<X class="h-5 w-5 text-gray-500" />
				</button>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 px-4 py-6 space-y-2">
				{#each navItems as item}
	{@const IconComponent = item.icon}

	{#if item.id === 'logout'}
		<!-- Logout form -->
		<form action="/logout" method="POST">
			<button
				type="submit"
				class="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
			>
				<IconComponent class="h-5 w-5" />
				<span class="font-medium">{item.label}</span>
			</button>
		</form>
	{:else}
		<button
			class="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors {currentView === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'}"
			onclick={() => {
				if (item.id === 'settings') {
					goto('/user');
				} else {
					currentView = item.id;
					selectedTeam = null;
				}
			}}
		>
			<IconComponent class="h-5 w-5" />
			<span class="font-medium">{item.label}</span>
		</button>
	{/if}
{/each}
			</nav>

			<!-- User Section -->
			<div class="p-4 border-t border-gray-200/50">
				<div class="flex items-center space-x-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
						<span class="text-sm font-medium text-white">{user.user_metadata.display_name.charAt(0) || 'U'}</span>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate">{user.user_metadata.display_name || 'User'}</p>
						<p class="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
					</div>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 lg:ml-64">

		<!-- Mobile sidebar toggle -->
		<button
			class="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 lg:hidden"
			onclick={() => sidebarCollapsed = !sidebarCollapsed}
		>
			<Users class="h-5 w-5 text-gray-600" />
		</button>

		<main class="px-6 py-8">
			<!-- My Storyboards View -->
			{#if currentView === 'my-storyboards'}
				<!-- Page Header -->
				<div class="mb-8">
					<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900">My Storyboards</h1>
							<p class="text-gray-600 mt-1">Create and manage your AI-powered storyboard projects</p>
						</div>

						<button
							class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
							onclick={() => {
								selectedStoryboard = null;
								goto('/storyboard');
							}}
						>
							<Plus class="h-5 w-5" />
							<span>New Storyboard</span>
						</button>
					</div>
				</div>

				<!-- Filters and Search -->
				<section class="mb-8 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
					<div class="flex flex-col gap-4 md:flex-row">
						<div class="relative flex-1">
							<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<input
								type="text"
								placeholder="Search storyboards..."
								class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
								bind:value={searchQuery}
							/>
						</div>

						<div class="flex items-center rounded-lg bg-gray-100 p-1">
							<button
								class="rounded-md p-2 transition-colors {viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
								onclick={() => (viewMode = 'grid')}
							>
								<Grid3X3 class="h-4 w-4" />
							</button>
							<button
								class="rounded-md p-2 transition-colors {viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
								onclick={() => (viewMode = 'list')}
							>
								<List class="h-4 w-4" />
							</button>
						</div>
					</div>
				</section>

				<!-- Storyboards Grid/List (existing code) -->
				<section aria-label="Projects">
					{#if viewMode === 'grid'}
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{#each filteredProjects() as storyboard (storyboard._id)}
								<div class="group rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-xl">
									<div class="relative">
										<div class="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-purple-600 to-blue-600">
											<Play class="h-12 w-12 text-white" />
										</div>
										<div class="absolute top-3 right-3">
											<button class="rounded-lg bg-white/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
												<MoreHorizontal class="h-4 w-4 text-gray-600" />
											</button>
										</div>
									</div>

									<div class="p-6">
										<div class="mb-3 flex items-start justify-between">
											<h3 class="truncate font-semibold text-gray-900">
												{storyboard.storyOutline.storyMetadata.title}
											</h3>
											<button
												class="p-1 text-gray-400 transition-colors hover:text-purple-600"
												onclick={() => {
													selectedStoryboard = storyboard;
													storyboardStore.set(selectedStoryboard);
													goto('/storyboard');
												}}
											>
												<UserPlus class="h-4 w-4" />
											</button>
										</div>

										<p class="mb-4 line-clamp-2 text-sm text-gray-600">{storyboard.prompts.concept}</p>

										<div class="mb-4 flex items-center justify-between text-xs text-gray-500">
											<span>{storyboard.visualSlides.length} slides</span>
											<span>{storyboard.updatedAt}</span>
										</div>

										<div class="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
											<button
												class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700"
												onclick={() => {
													selectedStoryboard = storyboard;
													storyboardStore.set(selectedStoryboard);
													goto('/storyboard');
												}}
											>
												Continue
											</button>
											<button class="p-2 text-gray-400 transition-colors hover:text-purple-600">
												<Video class="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- List view implementation similar to original -->
						<div class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-xl backdrop-blur-sm">
							<!-- List view content -->
						</div>
					{/if}
				</section>

			<!-- Teams View -->
			{:else if currentView === 'teams'}
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

			<!-- Team Storyboards View -->
			{:else if currentView === 'team-storyboards' && selectedTeam}
				<div class="mb-8">
					<div class="flex items-center space-x-2 mb-4">
						<button
							class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
							onclick={() => currentView = 'teams'}
						>
							<span>Teams</span>
							<ChevronRight class="h-4 w-4" />
						</button>
						<span class="font-medium text-gray-900">{selectedTeam.name}</span>
					</div>

					<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900">{selectedTeam.name} Storyboards</h1>
							<p class="text-gray-600 mt-1">Collaborative storyboard projects for your team</p>
						</div>

						<button
							class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
							onclick={() => {
								selectedStoryboard = null;
								goto('/storyboard');
							}}
						>
							<Plus class="h-5 w-5" />
							<span>New Team Storyboard</span>
						</button>
					</div>
				</div>

				<!-- Team storyboards would be displayed here similar to my-storyboards -->
				<div class="text-center py-12">
					<div class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
						<Users class="h-8 w-8 text-gray-400" />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900">No team storyboards yet</h3>
					<p class="mb-6 text-gray-500">Start creating collaborative storyboards with your team</p>
					<button
						class="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
						onclick={() => goto('/storyboard')}
					>
						Create First Storyboard
					</button>
				</div>
			{/if}
		</main>
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

					<div>
						<label for="team-description" class="mb-2 block text-sm font-medium text-gray-700">Description</label>
						<textarea
							id="team-description"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
							placeholder="Team description..."
							rows="3"
							bind:value={newTeam.description}
						></textarea>
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
</div>