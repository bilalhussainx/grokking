import type { Metadata } from 'next'
import HeroSection from '@/components/cinematic/HeroSection'
import LandingHeroWithChat from '@/components/landing/LandingHeroWithChat'
import ExitIntentModal from '@/components/landing/ExitIntentModal'
import ScrollSequence from '@/components/cinematic/ScrollSequence'
import Features from '@/components/cinematic/Features'
import Stats from '@/components/cinematic/Stats'
import CTASection from '@/components/cinematic/CTASection'

export const metadata: Metadata = {
  title: 'KairosLearn — Your AI-Powered College Application Coach',
  description:
    'The complete college prep platform. Essay Studio, Activities Optimizer, Interview Prep with 10 Ivy+ alumni personas, School List Builder, Recommendations Coach, and AI counselor sharing. $10/mo.',
}

// Feature flag — set NEXT_PUBLIC_LANDING_HERO_CHAT=false to revert to the
// static cinematic hero without risking the chat pipeline.
const HERO_CHAT_ENABLED = process.env.NEXT_PUBLIC_LANDING_HERO_CHAT !== 'false'

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--cine-bg, #05080d)', color: 'var(--cine-cream, #f2ede3)', fontFamily: 'var(--font-cine-body, -apple-system, sans-serif)', fontWeight: 300, overflowX: 'hidden' }}>
      {/* Film grain overlay */}
      <div className="cine-grain" aria-hidden="true" />

      {HERO_CHAT_ENABLED ? <LandingHeroWithChat /> : <HeroSection />}
      <ScrollSequence />
      <Features />
      <Stats />
      <CTASection />
      <ExitIntentModal />
    </main>
  )
}
