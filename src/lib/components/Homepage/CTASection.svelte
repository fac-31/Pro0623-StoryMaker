<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="bg-gradient-to-r from-purple-600 to-blue-600 py-20" aria-labelledby="cta-title">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<div class="space-y-8">
			<h2 id="cta-title" class="text-3xl font-bold text-white lg:text-5xl">
				Ready to Bring Your Stories to Life?
			</h2>
			<p class="text-primary-content/80 text-xl leading-relaxed">
				Join thousands of creators who are already using StoryMaker to visualize their ideas and
				captivate their audiences.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/signup" class="btn btn-secondary btn-lg focus-visible:ring">
					<span>Start Creating Free</span>
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href="/storyboard"
					class="btn btn-outline btn-lg hover:text-primary border-white text-white hover:bg-white focus-visible:ring"
				>
					Try Demo
				</a>
			</div>
		</div>
	</div>
</section>
