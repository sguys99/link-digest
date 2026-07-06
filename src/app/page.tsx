import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { AppMockupSection } from '@/components/landing/app-mockup-section'
import { InstallGuideSection } from '@/components/landing/install-guide-section'
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

        {/* 타일 리듬: white(how-it-works) → 다크 타일(app-mockup) → parchment(install-guide) */}
        <AnimateOnScroll>
          <AppMockupSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <InstallGuideSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <FinalCtaSection />
        </AnimateOnScroll>
      </main>

      <LandingFooter />
    </>
  )
}
