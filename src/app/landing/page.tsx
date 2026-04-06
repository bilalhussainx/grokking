import type { Metadata } from 'next'
import HeroSection from '@/components/cinematic/HeroSection'
import ScrollSequence from '@/components/cinematic/ScrollSequence'
import Features from '@/components/cinematic/Features'
import Stats from '@/components/cinematic/Stats'
import CTASection from '@/components/cinematic/CTASection'

export const metadata: Metadata = {
  title: 'KairosLearn — The AI Interview Coach That Teaches',
  description:
    'Mock interviews with AI that adapts to your level and teaches when you\'re stuck. 17 languages, 10 role types, real-time voice feedback. Try free.',
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
