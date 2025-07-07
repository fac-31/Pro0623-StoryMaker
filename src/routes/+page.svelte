<script lang="ts">
	import { Menu, X, Play, Palette, Users, BookOpen, ArrowRight, Check } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);

	const features = [
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

<main class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<!-- Header -->
	<header
		class="relative sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-4">
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

				<!-- Desktop Navigation -->
				<nav class="hidden items-center space-x-8 md:flex">
					<a
						href="#features"
						class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
						>Features</a
					>
					<a
						href="#how-it-works"
						class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
						>How it Works</a
					>
					<a
						href="#testimonials"
						class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
						>Testimonials</a
					>
				</nav>

				<div class="hidden items-center space-x-4 md:flex">
					<a
						href="/login"
						class="text-gray-600 transition-colors hover:text-purple-600 motion-reduce:transition-none"
						>Sign In</a
					>
					<a
						href="/signup"
						class="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transition-none motion-reduce:transform-none"
					>
						Start Creating
					</a>
				</div>

				<!-- Mobile menu button -->
				<button class="p-2 md:hidden" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<nav class="border-t border-gray-200 bg-white md:hidden">
				<div class="space-y-4 px-4 py-4">
					<a href="#features" class="block text-gray-600 hover:text-purple-600">Features</a>
					<a href="#how-it-works" class="block text-gray-600 hover:text-purple-600">How it Works</a>
					<a href="#testimonials" class="block text-gray-600 hover:text-purple-600">Testimonials</a>
					<div class="space-y-2 border-t border-gray-200 pt-4">
						<a href="/login" class="block w-full text-left text-gray-600">Sign In</a>
						<a
							href="/signup"
							class="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-center text-white"
						>
							Start Creating
						</a>
					</div>
				</div>
			</nav>
		{/if}
	</header>

	<!-- Hero Section -->
	<section class="relative overflow-hidden py-20 lg:py-32">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="space-y-8">
					<div class="space-y-4">
						<div
							class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
						>
							✨ AI-Powered Storyboarding
						</div>
						<h1 class="text-4xl leading-tight font-bold text-gray-900 lg:text-6xl">
							Turn Your
							<span
								class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
							>
								Stories
							</span>
							Into Visual Magic
						</h1>
						<p class="text-xl leading-relaxed text-gray-600">
							Create professional storyboards from your story ideas in minutes. Customize by style,
							target audience, and genre to bring your vision to life.
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row">
						<a
							href="/signup"
							class="flex transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
						>
							<span>Start Creating Free</span>
							<ArrowRight class="h-5 w-5" />
						</a>
						<a
							href="/storyboard"
							class="flex items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all hover:border-purple-300 hover:text-purple-600 motion-reduce:transition-none"
						>
							<Play class="h-5 w-5" />
							<span>Try Demo</span>
						</a>
					</div>

					<div class="flex items-center space-x-6 text-sm text-gray-500">
						<div class="flex items-center space-x-1">
							<Check class="h-4 w-4 text-green-500" />
							<span>No credit card required</span>
						</div>
						<div class="flex items-center space-x-1">
							<Check class="h-4 w-4 text-green-500" />
							<span>Free templates</span>
						</div>
					</div>
				</div>

				<div class="relative">
					<div
						class="rotate-3 transform rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 p-8 transition-transform duration-300 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none"
					>
						<div
							class="flex h-64 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-200 to-blue-200 shadow-2xl"
						>
							<div class="text-center text-purple-600">
								<BookOpen class="mx-auto mb-4 h-16 w-16" />
								<p class="text-lg font-semibold">StoryMaker Interface</p>
								<p class="text-sm">AI-Powered Storyboarding</p>
							</div>
						</div>
					</div>
					<div
						class="absolute -top-4 -right-4 rotate-12 transform rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-yellow-900"
					>
						New!
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
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
					<div
						class="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl motion-reduce:transition-none"
					>
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 transition-transform group-hover:scale-110 motion-reduce:transform-none"
						>
							{#if feature.icon}
								{@const Icon = feature.icon}
								<Icon class="h-6 w-6 text-white" />
							{/if}
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
						<p class="leading-relaxed text-gray-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
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
						<div
							class="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl motion-reduce:transition-none"
						>
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

	<!-- Testimonials Section -->
	<section id="testimonials" class="bg-white py-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-16 space-y-4 text-center">
				<div
					class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
				>
					Testimonials
				</div>
				<h2 class="text-3xl font-bold text-gray-900 lg:text-5xl">
					Loved by
					<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Creators Worldwide
					</span>
				</h2>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
		<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
			<div class="space-y-8">
				<h2 class="text-3xl font-bold text-white lg:text-5xl">
					Ready to Bring Your Stories to Life?
				</h2>
				<p class="text-xl leading-relaxed text-purple-100">
					Join thousands of creators who are already using StoryMaker to visualize their ideas and
					captivate their audiences.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href="/signup"
						class="flex transform items-center justify-center space-x-2 rounded-lg bg-white px-8 py-4 font-semibold text-purple-600 transition-all hover:scale-105 hover:bg-gray-50 motion-reduce:transform-none motion-reduce:transition-none"
					>
						<span>Start Creating Free</span>
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href="/storyboard"
						class="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-purple-600 motion-reduce:transition-none"
					>
						Try Demo
					</a>
				</div>
				<p class="text-sm text-purple-200">No credit card required • Free forever plan available</p>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 py-16 text-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid gap-8 md:grid-cols-4">
				<div class="space-y-4">
					<div class="flex items-center space-x-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
						>
							<Play class="h-4 w-4 text-white" />
						</div>
						<span class="text-xl font-bold">StoryMaker</span>
					</div>
					<p class="text-gray-400">
						Transform your story ideas into professional storyboards with AI-powered creativity.
					</p>
				</div>

				<div>
					<h3 class="mb-4 font-semibold">Product</h3>
					<ul class="space-y-2 text-gray-400">
						<li>
							<a
								href="#features"
								class="transition-colors hover:text-white motion-reduce:transition-none">Features</a
							>
						</li>
						<li>
							<a
								href="/storyboard"
								class="transition-colors hover:text-white motion-reduce:transition-none"
								>Storyboard</a
							>
						</li>
						<li>
							<a
								href="/langchain-agent"
								class="transition-colors hover:text-white motion-reduce:transition-none">AI Agent</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 font-semibold">Account</h3>
					<ul class="space-y-2 text-gray-400">
						<li>
							<a
								href="/signup"
								class="transition-colors hover:text-white motion-reduce:transition-none">Sign Up</a
							>
						</li>
						<li>
							<a
								href="/login"
								class="transition-colors hover:text-white motion-reduce:transition-none">Sign In</a
							>
						</li>
						<li>
							<a
								href="/logout"
								class="transition-colors hover:text-white motion-reduce:transition-none">Sign Out</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 font-semibold">Support</h3>
					<ul class="space-y-2 text-gray-400">
						<li>
							<a
								href="/help"
								class="transition-colors hover:text-white motion-reduce:transition-none"
								>Help Center</a
							>
						</li>
						<li>
							<a
								href="/privacy"
								class="transition-colors hover:text-white motion-reduce:transition-none">Privacy</a
							>
						</li>
						<li>
							<a
								href="/terms"
								class="transition-colors hover:text-white motion-reduce:transition-none">Terms</a
							>
						</li>
					</ul>
				</div>
			</div>

			<div
				class="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row"
			>
				<p class="text-gray-400">© 2024 StoryMaker. All rights reserved.</p>
				<div class="mt-4 flex space-x-6 md:mt-0">
					<a
						href="https://twitter.com"
						class="text-gray-400 transition-colors hover:text-white motion-reduce:transition-none"
						>Twitter</a
					>
					<a
						href="https://linkedin.com"
						class="text-gray-400 transition-colors hover:text-white motion-reduce:transition-none"
						>LinkedIn</a
					>
					<a
						href="https://instagram.com"
						class="text-gray-400 transition-colors hover:text-white motion-reduce:transition-none"
						>Instagram</a
					>
				</div>
			</div>
		</div>
	</footer>
</main>
