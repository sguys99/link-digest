import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { InstallGuideSection } from '@/components/landing/install-guide-section'
import { AppMockupSection } from '@/components/landing/app-mockup-section'
import { FinalCtaSection } from '@/components/landing/final-cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'

export default function Home() {
  return (
    <>
      <LandingHeader />

      <main>
        <HeroSection />

        <AnimateOnScroll>
          <FeaturesSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <HowItWorksSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <InstallGuideSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <AppMockupSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <FinalCtaSection />
        </AnimateOnScroll>
      </main>

      <LandingFooter />
    </>
  )
}
