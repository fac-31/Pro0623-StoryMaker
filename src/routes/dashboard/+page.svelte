<script lang="ts">
	import {
		Plus,
		Search,
		MoreHorizontal,
		Play,
		Edit3,
		Trash2,
		UserPlus,
		Settings,
		Bell,
		LogOut,
		Grid3X3,
		List,
		Clock,
		CheckCircle,
		AlertCircle,
		Video
	} from 'lucide-svelte';

	// State management
	let showNewProjectModal = $state(false);
	let showTeamModal = $state(false);
	let selectedProject = $state<(typeof projects)[0] | null>(null);
	let viewMode = $state('grid'); // 'grid' or 'list'
	let searchQuery = $state('');
	let filterStatus = $state('all');

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

	// Mock data - this would come from your database
	const projects = [
		{
			id: 1,
			concept: 'The Space Adventure',
			description: 'A thrilling sci-fi story about exploring distant galaxies',
			genre: 'Science Fiction',
			targetAudience: 'Young Adults',
			storyStyle: 'Cinematic',
			status: 'in-progress',
			progress: 65,
			lastModified: '2 hours ago',
			teamMembers: [
				{ name: 'John Doe', role: 'owner' },
				{ name: 'Jane Smith', role: 'editor' },
				{ name: 'Mike Johnson', role: 'viewer' }
			],
			scenes: 12,
			totalScenes: 18,
			numSlides: 18
		},
		{
			id: 2,
			concept: 'Mystery at Midnight',
			description: 'A detective story set in 1940s New York',
			genre: 'Mystery',
			targetAudience: 'Adults',
			storyStyle: 'Film Noir',
			status: 'completed',
			progress: 100,
			lastModified: '1 day ago',
			teamMembers: [
				{ name: 'Sarah Wilson', role: 'owner' },
				{ name: 'Tom Brown', role: 'editor' }
			],
			scenes: 24,
			totalScenes: 24,
			numSlides: 24
		},
		{
			id: 3,
			concept: 'Fairy Tale Kingdom',
			description: 'A magical adventure for children',
			genre: 'Fantasy',
			targetAudience: 'Children',
			storyStyle: 'Animated',
			status: 'draft',
			progress: 25,
			lastModified: '3 days ago',
			teamMembers: [{ name: 'Emma Davis', role: 'owner' }],
			scenes: 5,
			totalScenes: 20,
			numSlides: 20
		},
		{
			id: 4,
			concept: 'Corporate Training Video',
			description: 'Educational content for employee onboarding',
			genre: 'Educational',
			targetAudience: 'Professionals',
			storyStyle: 'Clean & Modern',
			status: 'review',
			progress: 90,
			lastModified: '5 hours ago',
			teamMembers: [
				{ name: 'Alex Chen', role: 'owner' },
				{ name: 'Lisa Park', role: 'editor' },
				{ name: 'David Kim', role: 'reviewer' }
			],
			scenes: 15,
			totalScenes: 16,
			numSlides: 16
		}
	];

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
		return projects.filter((project) => {
			const matchesSearch =
				project.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
			return matchesSearch && matchesFilter;
		});
	};

	// Functions
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
			const project = projects.find((p) => p.id === selectedProject.id);
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
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<!-- Header -->
	<header class="sticky top-0 z-40 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
		<div class="px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex items-center space-x-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
						>
							<Play class="h-4 w-4 text-white" />
						</div>
						<span
							class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent"
						>
							StoryMaker
						</span>
					</div>
					<nav class="ml-8 hidden items-center space-x-6 md:flex">
						<a href="/dashboard" class="font-medium text-purple-600">Dashboard</a>
						<a href="/storyboard" class="text-gray-600 transition-colors hover:text-purple-600"
							>Create Storyboard</a
						>
						<a href="/library" class="text-gray-600 transition-colors hover:text-purple-600"
							>Library</a
						>
					</nav>
				</div>

				<div class="flex items-center space-x-4">
					<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
						<Bell class="h-5 w-5" />
					</button>
					<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
						<Settings class="h-5 w-5" />
					</button>
					<div class="flex items-center space-x-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
						>
							<span class="text-sm font-medium text-white">JD</span>
						</div>
						<span class="hidden text-sm font-medium text-gray-700 md:block">John Doe</span>
					</div>
					<button class="p-2 text-gray-400 transition-colors hover:text-gray-600">
						<LogOut class="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="px-6 py-8">
		<!-- Page Header -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">My Storyboards</h1>
					<p class="mt-1 text-gray-600">Create and manage your AI-powered storyboard projects</p>
				</div>

				<button
					class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
					onclick={() => (showNewProjectModal = true)}
				>
					<Plus class="h-5 w-5" />
					<span>New Storyboard</span>
				</button>
			</div>
		</div>

		<!-- Filters and Search -->
		<div
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
						class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
						bind:value={searchQuery}
					/>
				</div>

				<!-- Status Filter -->
				<select
					class="rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
					bind:value={filterStatus}
				>
					<option value="all">All Status</option>
					<option value="draft">Draft</option>
					<option value="in-progress">In Progress</option>
					<option value="review">Under Review</option>
					<option value="completed">Completed</option>
				</select>

				<!-- View Toggle -->
				<div class="flex items-center rounded-lg bg-gray-100 p-1">
					<button
						class="rounded-md p-2 transition-colors {viewMode === 'grid'
							? 'bg-white text-purple-600 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'}"
						onclick={() => (viewMode = 'grid')}
					>
						<Grid3X3 class="h-4 w-4" />
					</button>
					<button
						class="rounded-md p-2 transition-colors {viewMode === 'list'
							? 'bg-white text-purple-600 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'}"
						onclick={() => (viewMode = 'list')}
					>
						<List class="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Projects Grid/List -->
		{#if viewMode === 'grid'}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredProjects() as project (project.id)}
					{@const SvelteComponent = getStatusIcon(project.status)}
					<div
						class="group rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-xl"
					>
						<!-- Project Thumbnail -->
						<div class="relative">
							<div
								class="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-purple-600 to-blue-600"
							>
								<Play class="h-12 w-12 text-white" />
							</div>
							<div class="absolute top-3 right-3">
								<button
									class="rounded-lg bg-white/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
								>
									<MoreHorizontal class="h-4 w-4 text-gray-600" />
								</button>
							</div>
							<div class="absolute bottom-3 left-3">
								<span
									class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(
										project.status
									)}"
								>
									<SvelteComponent class="mr-1 h-3 w-3" />
									{project.status.replace('-', ' ')}
								</span>
							</div>
						</div>

						<!-- Project Info -->
						<div class="p-6">
							<div class="mb-3 flex items-start justify-between">
								<h3 class="truncate font-semibold text-gray-900">{project.concept}</h3>
								<button
									class="p-1 text-gray-400 transition-colors hover:text-purple-600"
									onclick={() => {
										selectedProject = project;
										showTeamModal = true;
									}}
								>
									<UserPlus class="h-4 w-4" />
								</button>
							</div>

							<p class="mb-4 line-clamp-2 text-sm text-gray-600">{project.description}</p>

							<!-- Progress Bar -->
							<div class="mb-4">
								<div class="mb-2 flex items-center justify-between text-xs text-gray-500">
									<span>Progress</span>
									<span>{project.progress}%</span>
								</div>
								<div class="h-2 w-full rounded-full bg-gray-200">
									<div
										class="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
										style="width: {project.progress}%"
									></div>
								</div>
							</div>

							<!-- Project Meta -->
							<div class="mb-4 flex items-center justify-between text-xs text-gray-500">
								<span>{project.scenes}/{project.totalScenes} slides</span>
								<span>{project.lastModified}</span>
							</div>

							<!-- Team Members -->
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

							<!-- Action Buttons -->
							<div class="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
								<a
									href="/storyboard"
									class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700"
								>
									<Play class="mr-1 inline h-4 w-4" />
									Continue
								</a>
								<button class="p-2 text-gray-400 transition-colors hover:text-purple-600">
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
					{#each filteredProjects() as project (project.id)}
						{@const SvelteComponent_1 = getStatusIcon(project.status)}
						<div class="px-6 py-4 transition-colors hover:bg-gray-50/50">
							<div class="grid grid-cols-12 items-center gap-4">
								<!-- Project Info -->
								<div class="col-span-4 flex items-center space-x-3">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
									>
										<Play class="h-6 w-6 text-white" />
									</div>
									<div>
										<h3 class="font-medium text-gray-900">{project.concept}</h3>
										<p class="text-sm text-gray-500">{project.genre} • {project.targetAudience}</p>
									</div>
								</div>

								<!-- Status -->
								<div class="col-span-2">
									<span
										class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(
											project.status
										)}"
									>
										<SvelteComponent_1 class="mr-1 h-3 w-3" />
										{project.status.replace('-', ' ')}
									</span>
								</div>

								<!-- Progress -->
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
								</div>

								<!-- Team -->
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
												<span class="text-xs text-gray-600">+{project.teamMembers.length - 3}</span>
											</div>
										{/if}
									</div>
								</div>

								<!-- Modified -->
								<div class="col-span-2 flex items-center justify-between">
									<span class="text-sm text-gray-500">{project.lastModified}</span>
									<button class="p-1 text-gray-400 transition-colors hover:text-gray-600">
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
					class="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
					onclick={() => {
						searchQuery = '';
						filterStatus = 'all';
					}}
				>
					Clear Filters
				</button>
			</div>
		{/if}
	</main>

	<!-- New Project Modal -->
	{#if showNewProjectModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
				<div class="p-6">
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">Create New Storyboard</h2>
						<button
							class="p-2 text-gray-400 transition-colors hover:text-gray-600"
							onclick={() => (showNewProjectModal = false)}
						>
							<Plus class="h-5 w-5 rotate-45" />
						</button>
					</div>

					<form
						onsubmit={(e) => {
							e.preventDefault();
							createProject();
						}}
						class="space-y-4"
					>
						<div>
							<label for="projectConcept" class="mb-2 block text-sm font-medium text-gray-700"
								>Story Concept</label
							>
							<input
								id="projectConcept"
								type="text"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
								placeholder="Enter your story concept..."
								bind:value={newProject.concept}
								required
							/>
						</div>

						<div>
							<label for="projectDescription" class="mb-2 block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								id="projectDescription"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
								rows="3"
								placeholder="Describe your story..."
								bind:value={newProject.description}
							></textarea>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="projectGenre" class="mb-2 block text-sm font-medium text-gray-700"
									>Genre</label
								>
								<select
									id="projectGenre"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
									bind:value={newProject.genre}
								>
									<option value="">Select genre...</option>
									{#each genres as genre (genre)}
										<option value={genre}>{genre}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="projectAudience" class="mb-2 block text-sm font-medium text-gray-700"
									>Target Audience</label
								>
								<select
									id="projectAudience"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
									bind:value={newProject.targetAudience}
								>
									<option value="">Select audience...</option>
									{#each audiences as audience (audience)}
										<option value={audience}>{audience}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="projectStyle" class="mb-2 block text-sm font-medium text-gray-700"
									>Visual Style</label
								>
								<select
									id="projectStyle"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
									bind:value={newProject.storyStyle}
								>
									<option value="">Select style...</option>
									{#each styles as style (style)}
										<option value={style}>{style}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="projectSlides" class="mb-2 block text-sm font-medium text-gray-700"
									>Number of Slides</label
								>
								<input
									id="projectSlides"
									type="number"
									min="1"
									max="50"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
									bind:value={newProject.numSlides}
								/>
							</div>
						</div>

						<div class="flex space-x-3 pt-4">
							<button
								type="button"
								class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
								onclick={() => (showNewProjectModal = false)}
							>
								Cancel
							</button>
							<button
								type="submit"
								class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
							>
								Create Storyboard
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Team Management Modal -->
	{#if showTeamModal && selectedProject}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
				<div class="p-6">
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">Manage Team</h2>
						<button
							class="p-2 text-gray-400 transition-colors hover:text-gray-600"
							onclick={() => (showTeamModal = false)}
						>
							<Plus class="h-5 w-5 rotate-45" />
						</button>
					</div>

					<div class="mb-6">
						<h3 class="mb-3 font-medium text-gray-900">Current Team Members</h3>
						<div class="space-y-3">
							{#each selectedProject.teamMembers as member (member.name)}
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
										<button class="p-1 text-gray-400 transition-colors hover:text-red-600">
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
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
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
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500"
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
								class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
								onclick={() => (showTeamModal = false)}
							>
								Close
							</button>
							<button
								type="submit"
								class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
							>
								Add Member
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
