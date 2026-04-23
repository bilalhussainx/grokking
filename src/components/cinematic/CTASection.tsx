'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        padding: '120px 24px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#d4a84b',
          marginBottom: 28,
        }}
      >
        Your counselor is waiting
      </p>

      <h2
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(36px, 5.8vw, 68px)',
          fontWeight: 300,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          marginBottom: 24,
          color: '#f2ede3',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Every student deserves a counselor who{' '}
        <em style={{ fontStyle: 'italic', color: '#d4a84b' }}>actually knows them.</em>
      </h2>

      <p
        style={{
          fontSize: 16,
          color: 'rgba(242, 237, 227, 0.65)',
          fontWeight: 300,
          maxWidth: 620,
          margin: '0 auto 44px',
          lineHeight: 1.7,
        }}
      >
        Start free today. No credit card. Built for students who need full
        financial aid, and for every first-gen applicant who was told to figure
        it out alone.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/signup"
          className="cta-pulse"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '16px 36px',
            background: '#d4a84b',
            color: '#05080d',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Start for free — no credit card
        </Link>
        <Link
          href="#features"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '16px 36px',
            background: 'transparent',
            color: '#f2ede3',
            fontWeight: 400,
            fontSize: 14,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            border: '1px solid rgba(242, 237, 227, 0.2)',
            borderRadius: 4,
          }}
        >
          See how it works
        </Link>
      </div>
      <p
        style={{
          marginTop: 24,
          fontSize: 11,
          color: 'rgba(242, 237, 227, 0.4)',
          letterSpacing: '0.04em',
        }}
      >
        Free to start · No credit card · Trusted by students in 15+ countries
      </p>
      <style jsx>{`
        .cta-pulse {
          animation: cta-shimmer 2.6s ease-in-out infinite;
        }
        @keyframes cta-shimmer {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(212, 168, 75, 0.55);
          }
          50% {
            box-shadow: 0 0 0 14px rgba(212, 168, 75, 0);
          }
        }
      `}</style>
    </motion.section>
  )
}
