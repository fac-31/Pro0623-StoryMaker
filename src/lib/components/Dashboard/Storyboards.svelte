<script lang="ts">
	import {
		Plus,
		Trash,
		Search,
		Grid3X3,
		List,
		Play,
		MoreHorizontal,
		X,
		Video
	} from 'lucide-svelte';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import { storyboardStore } from '$lib/stores/storyboard';
	import { teamStore } from '$lib/stores/team';
	import type { Storyboard } from '$lib/models/storyboard.model';
	import type { Team } from '$lib/models/team.model';
	import type { User } from '$lib/models/user.model';

	interface Props {
		storyboards: Storyboard[];
		list: string[];
		user: User;
		team?: Team;
		users?: User[];
	}

	let { storyboards, list, user, team, users }: Props = $props();

	teamStore.set(team ? team : null);

	// State management
	let selectedStoryboard = $state<Storyboard | null>(null);
	let viewMode = $state('grid');
	let searchQuery = $state('');
	let showAddUserModal = $state(false);
	let showRemoveUserModal = $state<string | null>(null);
	let showDeleteModal = $state<Storyboard | null>(null);
	let admin = team?.users.find((teamuser) => (teamuser.user = user._id))?.role == 'admin';

	// Computed values
	const filteredProjects = $derived(
		storyboards.filter((storyboard) => {
			if (!list.includes(storyboard._id as string)) return false;

			const matchesSearch =
				storyboard.prompts.concept?.toLowerCase().includes((searchQuery ?? '').toLowerCase()) ||
				storyboard.storyOutline.storyMetadata.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
			return matchesSearch;
		})
	);

	function handleEditStoryboard(storyboard: Storyboard) {
		selectedStoryboard = storyboard;
		storyboardStore.set(selectedStoryboard);
		goto('/storyboard');
	}

	function handleNewStoryboard() {
		selectedStoryboard = null;
		goto('/storyboard');
	}

	async function handleDeleteStoryboard(storyboard: Storyboard) {
		try {
			const response = await fetch('/api/storyboard/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ storyboardId: storyboard._id })
			});

			if (response.ok) {
				// Remove from local state
				storyboards = storyboards.filter(s => s._id !== storyboard._id);
				showDeleteModal = null;
			} else {
				const error = await response.json();
				console.error('Failed to delete storyboard:', error);
				alert('Failed to delete storyboard: ' + (error.error || 'Unknown error'));
			}
		} catch (error) {
			console.error('Error deleting storyboard:', error);
			alert('Error deleting storyboard. Please try again.');
		}
	}
</script>

<section>
	<!-- Page Header -->
	<header class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-base-content text-3xl font-bold">
					{#if team}
						{team.name}'s Storyboards
					{:else}
						My Storyboards
					{/if}
				</h1>
				<p class="text-base-content/70 mt-1">
					Create and manage your AI-powered storyboard projects
				</p>
			</div>

			<button class="btn btn-primary" onclick={handleNewStoryboard}>
				<Plus class="h-5 w-5" />
				<span>New Storyboard</span>
			</button>
		</div>
	</header>

	<!-- Team members list -->
	{#if team && users}
		<section
			class="border-base-300/50 bg-base-100/80 mb-8 rounded-2xl border p-6 shadow-xl backdrop-blur-sm"
			aria-label="Members list"
		>
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 class="text-base-content text-2xl font-bold">Members list</h2>
				</div>

				{#if admin}
					<div>
						<button class="btn btn-primary" onclick={() => (showAddUserModal = true)}>
							<Plus class="h-5 w-5" />
							<span>Add User</span>
						</button>
					</div>
				{/if}
			</div>

			<table class="table w-auto">
				<tbody>
					{#each team.users as teamuser (teamuser.user)}
						<tr class="group border-base-300 hover:bg-base-200 border-b transition-colors">
							<td class="py-4">
								{users.find((user) => user._id == teamuser.user)?.name}
							</td>
							<td class="py-4">
								<form method="POST" action="?/updateUser" class="inline">
									<!-- Hidden inputs for identifying which user to update -->
									<input type="hidden" name="team_id" value={team._id} />
									<input type="hidden" name="user_id" value={teamuser.user} />

									<select
										name="role"
										class="select select-bordered select-sm"
										onchange={(e) => {
											const value = e.currentTarget.value;

											const formData = new FormData();
											formData.append('team_id', team._id as string);
											formData.append('user_id', teamuser.user as string);
											formData.append('role', value);

											fetch('?/updateUser', {
												method: 'POST',
												body: formData
											}).then((/*res*/) => {
												// TODO fix role not updated properly in frontend
											});
										}}
										disabled={!admin || user._id === teamuser.user}
									>
										<option value="user" selected={teamuser.role === 'user'}>Member</option>
										<option value="admin" selected={teamuser.role === 'admin'}>Admin</option>
									</select>
								</form>
							</td>
							{#if admin}
								<td>
									{#if user._id !== teamuser.user}
										<div>
											<button
												class="btn btn-square"
												onclick={() => (showRemoveUserModal = teamuser.user as string)}
											>
												<Trash class="h-5 w-5" />
											</button>
										</div>
									{/if}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}

	<!-- Filters and Search -->
	<section
		class="border-base-300/50 bg-base-100/80 mb-8 rounded-2xl border p-6 shadow-xl backdrop-blur-sm"
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

			<div class="bg-base-200 flex items-center rounded-lg p-1">
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
				{#each filteredProjects as storyboard (storyboard._id)}
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

							<div class="text-base-content/70 mb-4 flex items-center justify-between text-xs">
								<span>{storyboard.visualSlides.length} slides</span>
							</div>

							<div class="border-base-300 mt-4 flex items-center space-x-2 border-t pt-4">
								<button
									class="btn btn-primary btn-sm flex-1"
									onclick={() => handleEditStoryboard(storyboard)}
								>
									View/Edit
								</button>
								<button
									class="btn btn-outline btn-sm text-error hover:btn-error"
									onclick={() => (showDeleteModal = storyboard)}
									aria-label="Delete {storyboard.storyOutline.storyMetadata.title}"
								>
									<Trash class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- List view implementation -->
			<div
				class="border-base-300/50 bg-base-100/80 overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm"
			>
				{#if filteredProjects.length > 0}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr class="border-base-300 border-b">
									<th class="text-base-content text-left font-semibold">Storyboard</th>
									<th class="text-base-content text-left font-semibold">Genre</th>
									<th class="text-base-content text-left font-semibold">Slides</th>
									<th class="text-base-content text-left font-semibold">Status</th>
									<th class="text-base-content text-left font-semibold">Updated</th>
									<th class="text-base-content text-right font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredProjects as storyboard (storyboard._id)}
									<tr class="group border-base-300 hover:bg-base-200 border-b transition-colors">
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
													class="btn btn-outline btn-sm hover:btn-error opacity-0 transition-opacity group-hover:opacity-100"
													onclick={() => (showDeleteModal = storyboard)}
													aria-label="Delete {storyboard.storyOutline.storyMetadata.title}"
												>
													<Trash class="h-4 w-4" />
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
							class="bg-base-200 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
						>
							<Play class="text-base-content/40 h-8 w-8" />
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
</section>

<!-- Create Add User Modal -->
{#if showAddUserModal && team && users}
	<dialog class="popup inset-0 z-50 bg-black/50 p-4" open>
		<div class="bg-base-100 w-full max-w-md rounded-2xl p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-base-content text-xl font-semibold">Add User to team</h2>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (showAddUserModal = false)}
					aria-label="Close create team dialog"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="max-h-60 space-y-2 overflow-y-auto">
				{#each users as user (user._id)}
					{#if !team?.users.find((teamuser) => teamuser.user == user._id)}
						<form
							method="POST"
							action="?/addUser"
							use:enhance={() => {
								// This callback runs after the action completes
								return async ({ update }) => {
									await update();
									team.users.push({ user: user._id, role: 'user' });
									showAddUserModal = false;
								};
							}}
							class="space-y-4"
						>
							<input type="hidden" name="team_id" value={team._id} />
							<input type="hidden" name="user_id" value={user._id} />
							<button type="submit" class="btn btn-primary flex-1">
								<Plus class="h-5 w-5" />
								{user.name}
							</button>
						</form>
					{/if}
				{/each}
			</div>

			<div class="flex space-x-3 pt-4">
				<button
					type="button"
					class="btn btn-outline flex-1"
					onclick={() => (showAddUserModal = false)}
				>
					Cancel
				</button>
			</div>
		</div>
	</dialog>
{/if}

<!-- Create Remove User Modal -->
{#if showRemoveUserModal && team && users}
	<dialog class="popup inset-0 z-50 bg-black/50 p-4" open>
		<div class="w-full max-w-md rounded-2xl bg-white p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-base-content text-xl font-semibold">
					Are you sure you want to remove {users.find(
						(user) => (user._id as string) == showRemoveUserModal
					)?.name}?
				</h2>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (showRemoveUserModal = null)}
					aria-label="Close create team dialog"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				method="POST"
				action="?/removeUser"
				use:enhance={() => {
					// This callback runs after the action completes
					return async ({ update }) => {
						await update();
						team.users = team.users.filter((teamuser) => teamuser.user != showRemoveUserModal);
						showRemoveUserModal = null;
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="team_id" value={team._id} />
				<input type="hidden" name="user_id" value={showRemoveUserModal} />

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						class="btn btn-outline flex-1"
						onclick={() => (showRemoveUserModal = null)}
					>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary flex-1">Remove User</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

<!-- Delete Storyboard Confirmation Modal -->
{#if showDeleteModal}
	<dialog class="popup inset-0 z-50 bg-black/50 p-4" open>
		<div class="bg-base-100 w-full max-w-md rounded-2xl p-6 shadow-lg">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-base-content text-xl font-semibold">Delete Storyboard</h2>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (showDeleteModal = null)}
					aria-label="Close delete confirmation dialog"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="mb-6">
				<p class="text-base-content mb-4">
					Are you sure you want to delete <strong>"{showDeleteModal.storyOutline.storyMetadata.title}"</strong>?
				</p>
				<p class="text-base-content/70 text-sm">
					This action cannot be undone. All slides, images, and generated games will be permanently deleted.
				</p>
			</div>

			<div class="flex space-x-3">
				<button
					type="button"
					class="btn btn-outline flex-1"
					onclick={() => (showDeleteModal = null)}
				>
					Cancel
				</button>
				<button
					type="button"
					class="btn btn-error flex-1"
					onclick={() => showDeleteModal && handleDeleteStoryboard(showDeleteModal)}
				>
					<Trash class="h-4 w-4" />
					Delete
				</button>
			</div>
		</div>
	</dialog>
{/if}
