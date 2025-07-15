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
				<h1 class="text-3xl font-bold text-base-content">My Storyboards</h1>
				<p class="mt-1 text-base-content/70">Create and manage your AI-powered storyboard projects</p>
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
	>
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="relative flex-1">
				<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-base-content/40" />
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
				>
					<Grid3X3 class="h-4 w-4" />
				</button>
				<button
					class="rounded-md p-2 transition-colors {viewMode === 'list'
						? 'bg-base-100 text-primary shadow-sm'
						: 'text-base-content/70 hover:text-base-content'}"
					onclick={() => (viewMode = 'list')}
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
					<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow group"
					>
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
									<MoreHorizontal class="h-4 w-4 text-base-content/60" />
								</button>
							</div>
						</div>

						<div class="p-6">
							<div class="mb-3 flex items-start justify-between">
								<h3 class="truncate font-semibold text-base-content">
									{storyboard.storyOutline.storyMetadata.title}
								</h3>
								<button
									class="p-1 text-base-content/40 transition-colors hover:text-primary"
									onclick={() => handleEditStoryboard(storyboard)}
								>
									<UserPlus class="h-4 w-4" />
								</button>
							</div>

							<p class="mb-4 line-clamp-2 text-sm text-base-content/70">{storyboard.prompts.concept}</p>

							<div class="mb-4 flex items-center justify-between text-xs text-base-content/50">
								<span>{storyboard.visualSlides.length} slides</span>
								<span>{storyboard.updatedAt}</span>
							</div>

							<div class="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
								<button
									class="btn btn-primary btn-sm flex-1"
									onclick={() => handleEditStoryboard(storyboard)}
								>
									Continue
								</button>
								<button class="p-2 text-base-content/40 transition-colors hover:text-primary">
									<Video class="h-4 w-4" />
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
				<div class="p-6">
					<p class="text-base-content/50">List view implementation here</p>
				</div>
			</div>
		{/if}
	</section>
</div>
