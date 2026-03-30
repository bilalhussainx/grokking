import type { Metadata } from 'next'
import HeroSection from '@/components/cinematic/HeroSection'
import ScrollSequence from '@/components/cinematic/ScrollSequence'
import Features from '@/components/cinematic/Features'
import Stats from '@/components/cinematic/Stats'
import CTASection from '@/components/cinematic/CTASection'

export const metadata: Metadata = {
  title: 'KairosLearn — AI Interview Coach & Voice Tutor',
  description:
    'Practice mock interviews and learn in 17 languages with real-time AI voice coaching. 69+ courses, 10 career pathways.',
}

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--cine-bg, #05080d)', color: 'var(--cine-cream, #f2ede3)', fontFamily: 'var(--font-cine-body, -apple-system, sans-serif)', fontWeight: 300, overflowX: 'hidden' }}>
      {/* Film grain overlay */}
      <div className="cine-grain" aria-hidden="true" />

      <HeroSection />
      <ScrollSequence />
      <Features />
      <Stats />
      <CTASection />
    </main>
  )
}
