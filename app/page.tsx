import { HomeHero } from '@/components/home/hero'
import { AboutSection } from '@/components/home/about'
import { DaysSection } from '@/components/home/days'
import { FinalCta } from '@/components/home/final-cta'

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <DaysSection />
      <FinalCta />
    </main>
  )
}
