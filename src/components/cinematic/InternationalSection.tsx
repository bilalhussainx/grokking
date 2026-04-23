'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const BULLETS = [
  'Pakistani percentage GPA conversion (87% → 3.48/4.0)',
  'Need-blind schools for international students',
  'CSS Profile guidance (not just FAFSA)',
  'Voice counseling in Hindi, Punjabi, and Urdu',
  'A-levels and IB GPA conversion',
  'Scholarship filtering for international eligibility',
  'Timezone-aware deadline tracking',
]

export default function InternationalSection() {
  return (
    <motion.section
      id="international"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        padding: '100px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 60,
          alignItems: 'center',
          padding: '56px 44px',
          background:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.22)',
          borderRadius: 8,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#34d399',
              marginBottom: 14,
            }}
          >
            FOR INTERNATIONAL STUDENTS
          </p>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 300,
              color: '#f2ede3',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Applying to US colleges —{' '}
            <em style={{ fontStyle: 'italic', color: '#34d399' }}>
              from outside the US?
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(242, 237, 227, 0.7)',
              fontWeight: 300,
              marginBottom: 28,
            }}
          >
            We built KairosLearn with you specifically in mind. Every feature
            below works whether you&apos;re in Karachi, Lagos, Delhi, or
            Istanbul.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 26px',
                background: '#34d399',
                color: '#05080d',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              Start free — no US address required
            </Link>
            <Link
              href="/schools?need_blind_international=true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 26px',
                background: 'transparent',
                color: '#34d399',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 4,
              }}
            >
              See need-blind schools
            </Link>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {BULLETS.map((bullet) => (
            <li
              key={bullet}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: '1px solid rgba(242, 237, 227, 0.06)',
                fontSize: 15,
                color: 'rgba(242, 237, 227, 0.88)',
                fontWeight: 300,
                lineHeight: 1.55,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: '#34d399',
                  fontSize: 15,
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
