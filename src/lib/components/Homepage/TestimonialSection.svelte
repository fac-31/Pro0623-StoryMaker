<script lang="ts">
	const testimonials = [
		{
			quote:
				"StoryMaker has revolutionized our pre-production workflow. What used to take days now takes minutes. The AI-powered storyboarding is a game-changer for our creative team, allowing us to visualize our ideas with incredible speed and accuracy.",
			author: 'Jane Doe',
			role: 'Film Director'
		},
		{
			quote:
				"As an indie game developer, StoryMaker has been an invaluable tool. The ability to quickly generate and iterate on storyboards has saved me countless hours. The visual consistency and style options are fantastic, helping me to bring my game's narrative to life.",
			author: 'John Smith',
			role: 'Game Developer'
		},
		{
			quote:
				"We use StoryMaker to create compelling visual narratives for our marketing campaigns. The platform is intuitive, powerful, and has significantly improved our ability to communicate complex ideas to clients. The results speak for themselves in our campaign engagement.",
			author: 'Emily White',
			role: 'Marketing Manager'
		}
	];
</script>

<section id="testimonials" class="bg-base-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<div class="badge badge-primary badge-lg">Testimonials</div>
			<h2 class="text-base-content text-3xl font-bold lg:text-5xl">
				Loved by
				<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
					Creators Worldwide
				</span>
			</h2>
		</div>
		<div class="grid gap-8 md:grid-cols-3">
			{#each testimonials as testimonial}
				<div class="card bg-base-200 shadow-xl">
					<div class="card-body">
						<p class="text-base-content/80">"{testimonial.quote}"</p>
						<div class="mt-4">
							<p class="font-bold">{testimonial.author}</p>
							<p class="text-sm text-base-content/60">{testimonial.role}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
