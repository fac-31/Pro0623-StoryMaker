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

<div class="min-h-screen bg-base-200">
	<NavBar>
		<MarketingNav slot="nav" let:mobileMenuOpen {mobileMenuOpen} />
	</NavBar>
	<HeroSection />
	<FeatureSection />
	<StepSection />
	<TestimonialSection />
	<CtaSection />
	<Footer />
</div>
