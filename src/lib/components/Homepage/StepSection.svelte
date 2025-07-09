<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	const steps = [
		{
			step: '01',
			title: 'Share Your Story',
			description:
				'Input your story idea, plot points, or script. Our AI understands narrative structure.'
		},
		{
			step: '02',
			title: 'Define Your Style',
			description:
				'Select your preferred visual style, target audience, and genre to guide the creation.'
		},
		{
			step: '03',
			title: 'Generate & Refine',
			description:
				'Watch as your storyboard comes to life. Edit, rearrange, and perfect each frame.'
		}
	];
</script>

<section id="how-it-works" class="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<div
				class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
			>
				How It Works
			</div>
			<h2 class="text-3xl font-bold text-gray-900 lg:text-5xl">
				From Idea to Storyboard in
				<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
					3 Simple Steps
				</span>
			</h2>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each steps as step, index (step.step)}
				<div class="relative">
					<div class="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
						<div class="mb-4 text-4xl font-bold text-purple-600">{step.step}</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-900">{step.title}</h3>
						<p class="leading-relaxed text-gray-600">{step.description}</p>
					</div>
					{#if index < steps.length - 1}
						<div class="absolute top-1/2 -right-4 hidden -translate-y-1/2 transform md:block">
							<ArrowRight class="h-8 w-8 text-purple-300" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
