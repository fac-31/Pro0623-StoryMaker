<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { BookOpen, Palette, Users } from 'lucide-svelte';

	interface Feature {
		icon: ComponentType;
		title: string;
		description: string;
	}

	const features: Feature[] = [
		{
			icon: BookOpen,
			title: 'Story-Driven Creation',
			description:
				'Transform your story ideas into visual storyboards with AI-powered scene generation.'
		},
		{
			icon: Palette,
			title: 'Style Customization',
			description:
				'Choose from various artistic styles to match your vision - from sketchy to photorealistic.'
		},
		{
			icon: Users,
			title: 'Audience Targeting',
			description:
				'Tailor your storyboards for specific audiences - kids, teens, adults, or professionals.'
		}
	];
</script>

<section id="features" class="bg-white py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<div
				class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
			>
				Features
			</div>
			<h2 class="text-3xl font-bold text-gray-900 lg:text-5xl">
				Everything You Need to Create
				<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
					Amazing Storyboards
				</span>
			</h2>
			<p class="mx-auto max-w-3xl text-xl text-gray-600">
				From initial concept to final storyboard, StoryMaker provides all the tools you need to
				visualize your stories professionally.
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each features as feature (feature.title)}
				{@const Icon = feature.icon}
				<div
					class="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl motion-reduce:transition-none"
				>
					<div
						class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 transition-transform group-hover:scale-110 motion-reduce:transform-none"
					>
						<Icon class="h-6 w-6 text-white" />
					</div>
					<h3 class="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
					<p class="leading-relaxed text-gray-600">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
