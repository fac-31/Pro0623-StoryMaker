<script lang="ts">
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import MarketingNav from '$lib/components/NavBar/MarketingNav.svelte';
	import HeroSection from '$lib/components/Homepage/HeroSection.svelte';
	import FeatureSection from '$lib/components/Homepage/FeatureSection.svelte';
	import StepSection from '$lib/components/Homepage/StepSection.svelte';
	import TestimonialSection from '$lib/components/Homepage/TestimonialSection.svelte';
	import CtaSection from '$lib/components/Homepage/CtaSection.svelte';
	import Footer from '$lib/components/Homepage/Footer.svelte';
</script>

<div class="bg-base-200 min-h-screen">
	<NavBar>
		<MarketingNav
			slot="nav"
			let:mobileMenuOpen
			let:closeMobileMenu
			{mobileMenuOpen}
			{closeMobileMenu}
		/>
	</NavBar>
	<HeroSection />
	<FeatureSection />
	<StepSection />
	<TestimonialSection />
	<CtaSection />
	<Footer />
</div>
