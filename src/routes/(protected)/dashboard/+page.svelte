<script lang="ts">
	const { data } = $props();
	const { user, storyboards} = data;

	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import DashboardNav from '$lib/components/NavBar/DashboardNav.svelte';
	import type { Storyboard } from '$lib/models/storyboard.model';
	import {
		Plus,
		Search,
		MoreHorizontal,
		Play,
		Edit3,
		Trash2,
		UserPlus,
		Grid3X3,
		List,
		Clock,
		CheckCircle,
		AlertCircle,
		Video
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// State management
	//let showNewProjectModal = $state(false);
	let showTeamModal = $state(false);
	let selectedStoryboard = $state<(Storyboard) | null>(null);
	let viewMode = $state('grid'); // 'grid' or 'list'
	let searchQuery = $state('');
	let filterStatus = $state('all');

	console.log('Storyboards:', storyboards);

	// Form states
	let newProject = $state({
		concept: '',
		description: '',
		genre: '',
		targetAudience: '',
		storyStyle: '',
		numSlides: 6
	});

	let teamMember = $state({
		email: '',
		role: 'viewer'
	});

	const genres = [
		'Science Fiction',
		'Mystery',
		'Fantasy',
		'Romance',
		'Horror',
		'Comedy',
		'Drama',
		'Educational'
	];
	const audiences = ['Children', 'Teens', 'Young Adults', 'Adults', 'Professionals'];
	const styles = ['Cinematic', 'Animated', 'Sketchy', 'Comic Book', 'Film Noir', 'Clean & Modern'];
	const roles = ['viewer', 'editor', 'reviewer', 'admin'];

	// Computed values
	const filteredProjects = () => {
		return storyboards.filter((storyboard) => {
			const matchesSearch =
				storyboard.prompts.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
				storyboard.storyOutline.storyMetadata.title.toLowerCase().includes(searchQuery.toLowerCase());
			//const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
			return matchesSearch;
		});
	};

	// Functions
	/*
	function createProject() {
		if (newProject.concept.trim()) {
			const project = {
				id: Date.now(),
				...newProject,
				status: 'draft',
				progress: 0,
				lastModified: 'Just now',
				teamMembers: [{ name: 'You', role: 'owner' }],
				scenes: 0,
				totalScenes: newProject.numSlides
			};
			projects.push(project);

			// Reset form
			newProject = {
				concept: '',
				description: '',
				genre: '',
				targetAudience: '',
				storyStyle: '',
				numSlides: 6
			};
			showNewProjectModal = false;
		}
	}

	function addTeamMember() {
		if (teamMember.email.trim() && selectedProject) {
			const project = projects.find((p) => p.id === selectedProject!.id);
			if (project) {
				project.teamMembers.push({
					name: teamMember.email.split('@')[0],
					role: teamMember.role
				});
			}

			teamMember = { email: '', role: 'viewer' };
			showTeamModal = false;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'in-progress':
				return 'text-blue-600 bg-blue-100';
			case 'review':
				return 'text-yellow-600 bg-yellow-100';
			case 'draft':
				return 'text-gray-600 bg-gray-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'in-progress':
				return Play;
			case 'review':
				return AlertCircle;
			case 'draft':
				return Edit3;
			default:
				return Clock;
		}
	}
		*/
</script>

<div class="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<!-- Header -->
	<NavBar type="dashboard">
		<DashboardNav slot="nav" let:mobileMenuOpen {mobileMenuOpen} {user} />
	</NavBar>

	<!-- Main Content -->
	<main class="px-6 py-8">
		<!-- Page Header -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">My Storyboards</h1>
					<p class="text--600 mt-1">Create and manage your AI-powered storyboard projects</p>
				</div>

				<button
					class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
					onclick={() => (goto('/storyboard'))}
				>
					<Plus class="h-5 w-5" />
					<span>New Storyboard</span>
				</button>
			</div>
		</div>

		<!-- Filters and Search -->
		<section
			aria-label="Filters and Search"
			class="mb-8 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm"
		>
			<div class="flex flex-col gap-4 md:flex-row">
				<!-- Search -->
				<div class="relative flex-1">
					<Search
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
					/>
					<input
						type="text"
						placeholder="Search storyboards..."
						class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 motion-reduce:transition-none"
						bind:value={searchQuery}
					/>
				</div>

				<!-- Status Filter 
				
				<select
					class="rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 motion-reduce:transition-none"
					bind:value={filterStatus}
				>
					<option value="all">All Status</option>
					<option value="draft">Draft</option>
					<option value="in-progress">In Progress</option>
					<option value="review">Under Review</option>
					<option value="completed">Completed</option>
				</select> -->

				<!-- View Toggle -->
				<div class="flex items-center rounded-lg bg-gray-100 p-1">
					<button
						class="rounded-md p-2 transition-colors {viewMode === 'grid'
							? 'bg-white text-purple-600 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'} motion-reduce:transition-none"
						onclick={() => (viewMode = 'grid')}
					>
						<Grid3X3 class="h-4 w-4" />
					</button>
					<button
						class="rounded-md p-2 transition-colors {viewMode === 'list'
							? 'bg-white text-purple-600 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'} motion-reduce:transition-none"
						onclick={() => (viewMode = 'list')}
					>
						<List class="h-4 w-4" />
					</button>
				</div>
			</div>
		</section>

		<!-- Projects Grid/List -->
		<section aria-label="Projects">
			{#if viewMode === 'grid'}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each filteredProjects() as storyboard (storyboard._id)}
						<!--{@const SvelteComponent = getStatusIcon(project.status)} -->
						<div
							class="group rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-xl motion-reduce:transition-none"
						>
							<!-- storyboard Thumbnail -->
							<div class="relative">
								<div
									class="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-purple-600 to-blue-600"
								>
									<Play class="h-12 w-12 text-white" />
								</div>
								<div class="absolute top-3 right-3">
									<button
										class="rounded-lg bg-white/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
									>
										<MoreHorizontal class="h-4 w-4 text-gray-600" />
									</button>
								</div>
								<!--
								<div class="absolute bottom-3 left-3">
									<span
										class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(
											storyboard.status
										)}"
									>
										<SvelteComponent class="mr-1 h-3 w-3" />
										{storyboard.status.replace('-', ' ')}
									</span>
								</div>
								-->
							</div>

							<!-- Project Info -->
							<div class="p-6">
								<div class="mb-3 flex items-start justify-between">
									<h3 class="truncate font-semibold text-gray-900">{storyboard.storyOutline.storyMetadata.title}</h3>
									<button
										class="p-1 text-gray-400 transition-colors hover:text-purple-600 motion-reduce:transition-none"
										onclick={() => {
											selectedStoryboard = storyboard;
											showTeamModal = true;
										}}
									>
										<UserPlus class="h-4 w-4" />
									</button>
								</div>

								<p class="mb-4 line-clamp-2 text-sm text-gray-600">{storyboard.prompts.concept}</p>

								<!-- Progress Bar 
								<div class="mb-4">
									<div class="mb-2 flex items-center justify-between text-xs text-gray-500">
										<span>Progress</span>
										<span>{project.progress}%</span>
									</div>
									<div class="h-2 w-full rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all motion-reduce:transition-none"
											style="width: {project.progress}%"
										></div>
									</div>
								</div> -->

								<!-- Project Meta -->
								<div class="mb-4 flex items-center justify-between text-xs text-gray-500">
									<span>{storyboard.visualSlides.length} slides</span>
									<span>{storyboard.updatedAt}</span>
								</div>

								<!-- Team Members 
								<div class="flex items-center justify-between">
									<div class="flex -space-x-2">
										{#each project.teamMembers.slice(0, 3) as member (member.name)}
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-purple-600 to-blue-600"
												title={member.name}
											>
												<span class="text-xs font-medium text-white"
													>{member.name
														.split(' ')
														.map((n) => n[0])
														.join('')}</span
												>
											</div>
										{/each}
										{#if project.teamMembers.length > 3}
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200"
											>
												<span class="text-xs text-gray-600">+{project.teamMembers.length - 3}</span>
											</div>
										{/if}
									</div>

									<div class="flex items-center space-x-1">
										<span class="text-xs text-gray-500">{project.genre}</span>
									</div>
								</div>
								-->

								<!-- Action Buttons -->
								<div class="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
									<a
										href="/storyboard"
										class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
									>
										<Play class="mr-1 inline h-4 w-4" />
										Continue
									</a>
									<button
										class="p-2 text-gray-400 transition-colors hover:text-purple-600 motion-reduce:transition-none"
									>
										<Video class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- List View -->
				<div
					class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-xl backdrop-blur-sm"
				>
					<div class="border-b border-gray-200/50 bg-gray-50/50 px-6 py-4">
						<div
							class="grid grid-cols-12 gap-4 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							<div class="col-span-4">Storyboard</div>
							<div class="col-span-2">Status</div>
							<div class="col-span-2">Progress</div>
							<div class="col-span-2">Team</div>
							<div class="col-span-2">Modified</div>
						</div>
					</div>

					<div class="divide-y divide-gray-200/50">
						{#each filteredProjects() as storyboard (storyboard._id)}
							<!-- {@const SvelteComponent_1 = getStatusIcon(project.status)}-->
							<div
								class="px-6 py-4 transition-colors hover:bg-gray-50/50 motion-reduce:transition-none"
							>
								<div class="grid grid-cols-12 items-center gap-4">
									<!-- Project Info -->
									<div class="col-span-4 flex items-center space-x-3">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
										>
											<Play class="h-6 w-6 text-white" />
										</div>
										<div>
											<h3 class="font-medium text-gray-900">{storyboard.storyOutline.storyMetadata.title}</h3>
											<p class="text-sm text-gray-500">
												{storyboard.storyOutline.storyMetadata.genre} • {storyboard.storyOutline.storyMetadata.targetAudience}
											</p>
										</div>
									</div>

									<!-- Status
									<div class="col-span-2">
										<span
											class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(
												project.status
											)}"
										>
											<SvelteComponent_1 class="mr-1 h-3 w-3" />
											{project.status.replace('-', ' ')}
										</span>
									</div> -->

									<!-- Progress 
									<div class="col-span-2">
										<div class="flex items-center space-x-2">
											<div class="h-2 flex-1 rounded-full bg-gray-200">
												<div
													class="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
													style="width: {project.progress}%"
												></div>
											</div>
											<span class="text-sm text-gray-600">{project.progress}%</span>
										</div>
									</div> -->

									<!-- Team 
									<div class="col-span-2">
										<div class="flex -space-x-2">
											{#each project.teamMembers.slice(0, 3) as member (member.name)}
												<div
													class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-purple-600 to-blue-600"
													title={member.name}
												>
													<span class="text-xs font-medium text-white"
														>{member.name
															.split(' ')
															.map((n) => n[0])
															.join('')}</span
													>
												</div>
											{/each}
											{#if project.teamMembers.length > 3}
												<div
													class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200"
												>
													<span class="text-xs text-gray-600"
														>+{project.teamMembers.length - 3}</span
													>
												</div>
											{/if}
										</div>
									</div> -->

									<!-- Modified -->
									<div class="col-span-2 flex items-center justify-between">
										<span class="text-sm text-gray-500">{storyboard.updatedAt}</span>
										<button
											class="p-1 text-gray-400 transition-colors hover:text-gray-600 motion-reduce:transition-none"
										>
											<MoreHorizontal class="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Empty State -->
			{#if filteredProjects().length === 0}
				<div class="py-12 text-center">
					<div
						class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100"
					>
						<Search class="h-8 w-8 text-gray-400" />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900">No storyboards found</h3>
					<p class="mb-6 text-gray-500">Try adjusting your search or filter criteria</p>
					<button
						class="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
						onclick={() => {
							searchQuery = '';
							filterStatus = 'all';
						}}
					>
						Clear Filters
					</button>
				</div>
			{/if}
		</section>
	</main>

	<!-- Team Management Modal 
	{#if showTeamModal && selectedStoryboard}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
				<div class="p-6">
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">Manage Team</h2>
						<button
							class="p-2 text-gray-400 transition-colors hover:text-gray-600 motion-reduce:transition-none"
							onclick={() => (showTeamModal = false)}
						>
							<Plus class="h-5 w-5 rotate-45" />
						</button>
					</div>

					<div class="mb-6">
						<h3 class="mb-3 font-medium text-gray-900">Current Team Members</h3>
						<div class="space-y-3">
							{#each selectedStoryboard.teamMembers as member (member.name)}
								<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
									<div class="flex items-center space-x-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
										>
											<span class="text-sm font-medium text-white"
												>{member.name
													.split(' ')
													.map((n) => n[0])
													.join('')}</span
											>
										</div>
										<div>
											<div class="font-medium text-gray-900">{member.name}</div>
											<div class="text-sm text-gray-500 capitalize">{member.role}</div>
										</div>
									</div>
									{#if member.role !== 'owner'}
										<button
											class="p-1 text-gray-400 transition-colors hover:text-red-600 motion-reduce:transition-none"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<form
						onsubmit={(e) => {
							e.preventDefault();
							addTeamMember();
						}}
						class="space-y-4"
					>
						<div>
							<label for="teamEmail" class="mb-2 block text-sm font-medium text-gray-700"
								>Email Address</label
							>
							<input
								id="teamEmail"
								type="email"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 motion-reduce:transition-none"
								placeholder="Enter email address..."
								bind:value={teamMember.email}
								required
							/>
						</div>

						<div>
							<label for="teamRole" class="mb-2 block text-sm font-medium text-gray-700">Role</label
							>
							<select
								id="teamRole"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 motion-reduce:transition-none"
								bind:value={teamMember.role}
							>
								{#each roles as role (role)}
									<option value={role} class="capitalize">{role}</option>
								{/each}
							</select>
						</div>

						<div class="flex space-x-3 pt-4">
							<button
								type="button"
								class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none"
								onclick={() => (showTeamModal = false)}
							>
								Close
							</button>
							<button
								type="submit"
								class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
							>
								Add Member
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
	-->
</div>
