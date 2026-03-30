'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section style={{
      padding: '120px 24px',
      textAlign: 'center' as const,
      position: 'relative' as const,
    }}>
      <p style={{
        fontSize: 11,
        letterSpacing: '0.3em',
        textTransform: 'uppercase' as const,
        color: '#d4a84b',
        marginBottom: 28,
      }}>Begin Today</p>

      <h2 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(40px, 6vw, 72px)',
        fontWeight: 300,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        marginBottom: 48,
        color: '#f2ede3',
      }}>
        Ready to ace your<br />
        next <em style={{ fontStyle: 'italic', color: '#d4a84b' }}>interview?</em>
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' as const }}>
        <Link
          href="/interviews"
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
          Try a Mock Interview — Free
        </Link>
        <Link
          href="/talk"
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
          Or talk to an AI tutor
        </Link>
      </div>
    </section>
  )
}
