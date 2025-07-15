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

<section id="features" class="bg-base-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<div class="badge badge-primary badge-lg">Features</div>
			<h2 class="text-base-content text-3xl font-bold lg:text-5xl">
				Everything You Need to Create
				<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
					Amazing Storyboards
				</span>
			</h2>
			<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
				From initial concept to final storyboard, StoryMaker provides all the tools you need to
				visualize your stories professionally.
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each features as feature (feature.title)}
				{@const Icon = feature.icon}
				<div class="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl">
					<div class="card-body">
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 transition-transform group-hover:scale-110"
						>
							<Icon class="h-6 w-6 text-white" />
						</div>
						<h3 class="card-title">{feature.title}</h3>
						<p>{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
