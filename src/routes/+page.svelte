<script lang="ts">
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import MarketingNav from '$lib/components/NavBar/MarketingNav.svelte';
	import HeroSection from '$lib/components/Homepage/HeroSection.svelte';
	import FeatureSection from '$lib/components/Homepage/FeatureSection.svelte';
	import StepSection from '$lib/components/Homepage/StepSection.svelte';
	import TestimonialSection from '$lib/components/Homepage/TestimonialSection.svelte';
	import CtaSection from '$lib/components/Homepage/CTASection.svelte';
	import Footer from '$lib/components/Homepage/Footer.svelte';
</script>

<main class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
	<NavBar type="home">
		<MarketingNav slot="nav" let:mobileMenuOpen {mobileMenuOpen} />
	</NavBar>
	<section>
		<HeroSection />
	</section>
	<section>
		<FeatureSection />
	</section>
	<section>
		<StepSection />
	</section>
	<section>
		<TestimonialSection />
	</section>
	<section>
		<CtaSection />
	</section>
	<section>
		<Footer />
	</section>
</main>
