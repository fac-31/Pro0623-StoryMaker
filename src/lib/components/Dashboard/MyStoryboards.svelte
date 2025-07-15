<script lang="ts">
	import {
		Plus,
		Search,
		Grid3X3,
		List,
		Play,
		MoreHorizontal,
		UserPlus,
		Video
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { storyboardStore } from '$lib/stores/storyboard';
	import type { Storyboard } from '$lib/models/storyboard.model';

	interface Props {
		storyboards: Storyboard[];
	}

	let { storyboards }: Props = $props();

	// State management
	let selectedStoryboard = $state<Storyboard | null>(null);
	let viewMode = $state('grid');
	let searchQuery = $state('');

	// Computed values
	const filteredProjects = () => {
		return storyboards.filter((storyboard) => {
			const matchesSearch =
				storyboard.prompts.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
				storyboard.storyOutline.storyMetadata.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
			return matchesSearch;
		});
	};

	function handleEditStoryboard(storyboard: Storyboard) {
		selectedStoryboard = storyboard;
		storyboardStore.set(selectedStoryboard);
		goto('/storyboard');
	}

	function handleNewStoryboard() {
		selectedStoryboard = null;
		goto('/storyboard');
	}
</script>

<div>
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-base-content text-3xl font-bold">My Storyboards</h1>
				<p class="text-base-content/70 mt-1">
					Create and manage your AI-powered storyboard projects
				</p>
			</div>

			<button class="btn btn-primary" onclick={handleNewStoryboard}>
				<Plus class="h-5 w-5" />
				<span>New Storyboard</span>
			</button>
		</div>
	</div>

	<!-- Filters and Search -->
	<section
		class="mb-8 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm"
		aria-label="Search and filter storyboards"
	>
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="relative flex-1">
				<Search
					class="text-base-content/40 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform"
				/>
				<input
					type="text"
					placeholder="Search storyboards..."
					class="input input-bordered w-full pl-10"
					bind:value={searchQuery}
				/>
			</div>

			<div class="flex items-center rounded-lg bg-gray-100 p-1">
				<button
					class="rounded-md p-2 transition-colors {viewMode === 'grid'
						? 'bg-base-100 text-primary shadow-sm'
						: 'text-base-content/70 hover:text-base-content'}"
					onclick={() => (viewMode = 'grid')}
					aria-label="Grid view"
					aria-pressed={viewMode === 'grid'}
				>
					<Grid3X3 class="h-4 w-4" />
				</button>
				<button
					class="rounded-md p-2 transition-colors {viewMode === 'list'
						? 'bg-base-100 text-primary shadow-sm'
						: 'text-base-content/70 hover:text-base-content'}"
					onclick={() => (viewMode = 'list')}
					aria-label="List view"
					aria-pressed={viewMode === 'list'}
				>
					<List class="h-4 w-4" />
				</button>
			</div>
		</div>
	</section>

	<!-- Storyboards Grid/List -->
	<section aria-label="Projects">
		{#if viewMode === 'grid'}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredProjects() as storyboard (storyboard._id)}
					<div class="card bg-base-100 group shadow-xl transition-shadow hover:shadow-2xl">
						<div class="relative">
							<div
								class="flex h-48 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-purple-600 to-blue-600"
							>
								{#if storyboard.visualSlides.length > 0 && storyboard.visualSlides[0].imageUrl}
									<img
										src={storyboard.visualSlides[0].imageUrl}
										alt="First slide of {storyboard.storyOutline.storyMetadata.title}"
										class="h-full w-full object-cover"
									/>
								{:else}
									<Play class="h-12 w-12 text-white" />
								{/if}
							</div>
						</div>

						<div class="p-6">
							<div class="mb-3 flex items-start justify-between">
								<h3 class="text-base-content truncate font-semibold">
									{storyboard.storyOutline.storyMetadata.title}
								</h3>
							</div>

							<p class="text-base-content/70 mb-4 line-clamp-2 text-sm">
								{storyboard.prompts.concept}
							</p>

							<div class="text-base-content/50 mb-4 flex items-center justify-between text-xs">
								<span>{storyboard.visualSlides.length} slides</span>
							</div>

							<div class="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
								<button
									class="btn btn-primary btn-sm flex-1"
									onclick={() => handleEditStoryboard(storyboard)}
								>
									View/Edit
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- List view implementation -->
			<div
				class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-xl backdrop-blur-sm"
			>
				{#if filteredProjects().length > 0}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr class="border-b border-gray-200">
									<th class="text-base-content text-left font-semibold">Storyboard</th>
									<th class="text-base-content text-left font-semibold">Genre</th>
									<th class="text-base-content text-left font-semibold">Slides</th>
									<th class="text-base-content text-left font-semibold">Status</th>
									<th class="text-base-content text-left font-semibold">Updated</th>
									<th class="text-base-content text-right font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredProjects() as storyboard (storyboard._id)}
									<tr class="group border-b border-gray-100 transition-colors hover:bg-gray-50">
										<td class="py-4">
											<div class="flex items-center space-x-3">
												<div
													class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
												>
													{#if storyboard.visualSlides.length > 0 && storyboard.visualSlides[0].imageUrl}
														<img
															src={storyboard.visualSlides[0].imageUrl}
															alt="First slide of {storyboard.storyOutline.storyMetadata.title}"
															class="h-full w-full object-cover"
														/>
													{:else}
														<Play class="h-6 w-6 text-white" />
													{/if}
												</div>
												<div class="min-w-0 flex-1">
													<h3 class="text-base-content truncate font-semibold">
														{storyboard.storyOutline.storyMetadata.title}
													</h3>
													<p class="text-base-content/70 truncate text-sm">
														{storyboard.prompts.concept}
													</p>
												</div>
											</div>
										</td>
										<td class="py-4">
											<div class="text-sm">
												<div class="text-base-content font-medium">
													{storyboard.storyOutline.storyMetadata.genre}
												</div>
												<div class="text-base-content/70">
													{storyboard.storyOutline.storyMetadata.targetAudience}
												</div>
											</div>
										</td>
										<td class="py-4">
											<span class="badge badge-primary badge-sm">
												{storyboard.visualSlides.length}
											</span>
										</td>
										<td class="py-4">
											<span class="badge badge-outline badge-sm">
												{storyboard.status}
											</span>
										</td>
										<td class="py-4">
											<div class="text-base-content/70 text-sm">
												{new Date(storyboard.updatedAt).toLocaleDateString()}
											</div>
										</td>
										<td class="py-4">
											<div class="flex items-center justify-end space-x-2">
												<button
													class="btn btn-primary btn-sm"
													onclick={() => handleEditStoryboard(storyboard)}
													aria-label="Edit {storyboard.storyOutline.storyMetadata.title}"
												>
													Continue
												</button>
												<button
													class="btn btn-ghost btn-sm opacity-0 transition-opacity group-hover:opacity-100"
													aria-label="More options for {storyboard.storyOutline.storyMetadata
														.title}"
												>
													<MoreHorizontal class="h-4 w-4" />
												</button>
												<button
													class="btn btn-ghost btn-sm opacity-0 transition-opacity group-hover:opacity-100"
													aria-label="Export {storyboard.storyOutline.storyMetadata.title} as video"
												>
													<Video class="h-4 w-4" />
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="p-12 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
						>
							<Play class="h-8 w-8 text-gray-400" />
						</div>
						<h3 class="text-base-content mb-2 text-lg font-medium">No storyboards found</h3>
						<p class="text-base-content/70 mb-6">
							{searchQuery
								? 'Try adjusting your search terms.'
								: 'Create your first storyboard to get started.'}
						</p>
						{#if !searchQuery}
							<button class="btn btn-primary" onclick={handleNewStoryboard}>
								<Plus class="h-5 w-5" />
								Create Storyboard
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
