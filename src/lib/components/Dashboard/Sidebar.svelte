<script lang="ts">
	import { Play, X, Home, Users, Settings, Bell, LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';
	import ThemeToggle from '../ThemeToggle.svelte';

	interface Props {
		supabase: User;
		currentView: string;
		sidebarCollapsed: boolean;
		onViewChange: (view: string) => void;
		onToggleSidebar: () => void;
	}

	let { supabase, currentView, sidebarCollapsed, onViewChange, onToggleSidebar }: Props = $props();

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
	class="border-base-300/50 bg-base-100/80 fixed inset-y-0 left-0 z-50 w-64 border-r backdrop-blur-sm transition-transform duration-300 {sidebarCollapsed
		? '-translate-x-full'
		: 'translate-x-0'} lg:translate-x-0"
>
	<div class="flex h-full flex-col">
		<!-- Sidebar Header -->
		<header class="border-base-300/50 flex items-center justify-between border-b p-6">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<Play class="h-5 w-5 text-white" />
				</div>
				<span class="text-base-content font-semibold">Story Maker</span>
			</div>
			<button
				class="btn btn-ghost btn-sm lg:hidden"
				onclick={onToggleSidebar}
				aria-label="Close sidebar"
			>
				<X class="h-5 w-5" />
			</button>
		</header>

		<!-- Navigation -->
		<nav class="flex-1 space-y-2 px-4 py-6">
			{#each navItems as item (item.id)}
				{@const IconComponent = item.icon}

				{#if item.id === 'logout'}
					<!-- Logout form -->
					<form action="/logout" method="POST">
						<button type="submit" class="btn btn-ghost w-full justify-start">
							<IconComponent class="h-5 w-5" />
							<span class="font-medium">{item.label}</span>
						</button>
					</form>

					<!-- Theme Toggle -->
					<div class="flex items-center justify-between px-3 py-2">
						<span class="text-base-content text-sm font-medium">Theme</span>
						<ThemeToggle />
					</div>
				{:else}
					<button
						class="btn btn-ghost w-full justify-start {currentView === item.id ? 'btn-active' : ''}"
						onclick={() => handleNavClick(item.id)}
					>
						<IconComponent class="h-5 w-5" />
						<span class="font-medium">{item.label}</span>
					</button>
				{/if}
			{/each}
		</nav>

		<!-- User Section -->
		<section class="border-base-300/50 border-t p-4" aria-label="User Profile">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<span class="text-sm font-medium text-white"
						>{supabase.user_metadata.display_name?.charAt(0) || 'U'}</span
					>
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-base-content truncate text-sm font-medium">
						{supabase.user_metadata.display_name || 'User'}
					</p>
					<p class="text-base-content/75 truncate text-xs">
						{supabase.email || 'user@example.com'}
					</p>
				</div>
			</div>
		</section>
	</div>
</aside>
