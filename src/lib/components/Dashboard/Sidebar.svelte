<script lang="ts">
	import { Play, X, Home, Users, Settings, Bell, LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	interface Props {
		user: any;
		currentView: string;
		sidebarCollapsed: boolean;
		onViewChange: (view: string) => void;
		onToggleSidebar: () => void;
	}

	let { user, currentView, sidebarCollapsed, onViewChange, onToggleSidebar }: Props = $props();

	// Navigation items
	const navItems = [
		{ id: 'my-storyboards', label: 'My Storyboards', icon: Home },
		{ id: 'my-teams', label: 'My Teams', icon: Users },
		{ id: 'settings', label: 'Settings', icon: Settings },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'logout', label: 'Logout', icon: LogOut }
	];

	function handleNavClick(itemId: string) {
		if (itemId === 'settings') {
			goto('/user');
		} else if (itemId !== 'logout') {
			onViewChange(itemId);
		}
	}
</script>

<aside
	class="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200/50 bg-white/80 backdrop-blur-sm transition-transform duration-300 {sidebarCollapsed
		? '-translate-x-full'
		: 'translate-x-0'} lg:translate-x-0"
>
	<div class="flex h-full flex-col">
		<!-- Sidebar Header -->
		<div class="flex items-center justify-between border-b border-gray-200/50 p-6">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<Play class="h-5 w-5 text-white" />
				</div>
				<span class="font-semibold text-gray-900">Story Maker</span>
			</div>
			<button class="rounded-lg p-1 hover:bg-gray-100 lg:hidden" onclick={onToggleSidebar}>
				<X class="h-5 w-5 text-gray-500" />
			</button>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-2 px-4 py-6">
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
						class="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors {currentView ===
						item.id
							? 'bg-purple-100 text-purple-700'
							: 'text-gray-700 hover:bg-gray-100'}"
						onclick={() => handleNavClick(item.id)}
					>
						<IconComponent class="h-5 w-5" />
						<span class="font-medium">{item.label}</span>
					</button>
				{/if}
			{/each}
		</nav>

		<!-- User Section -->
		<div class="border-t border-gray-200/50 p-4">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<span class="text-sm font-medium text-white"
						>{user.user_metadata.display_name?.charAt(0) || 'U'}</span
					>
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-gray-900">
						{user.user_metadata.display_name || 'User'}
					</p>
					<p class="truncate text-xs text-gray-500">{user.email || 'user@example.com'}</p>
				</div>
			</div>
		</div>
	</div>
</aside>
