'use client'

import styles from './Features.module.css'

const FEATURES = [
  {
    icon: '\u270D',
    title: 'Essay Studio',
    desc:  'AI-guided brainstorming, outline generation, and draft coaching. Personal statements, supplementals, and Why Us essays — each with phase tracking from brainstorm to polish.',
  },
  {
    icon: '\u25CE',
    title: 'Interview Prep',
    desc:  'Practice with 10 Ivy+ alumni AI personas. Harvard, Yale, Stanford, MIT, and more. 4-session adaptive arc with detailed scorecards and essay-aware questioning.',
  },
  {
    icon: '\u25C8',
    title: 'Activities Optimizer',
    desc:  'AI reviews your Common App activities list. Get description rewrites, impact scoring, optimal ordering, and gap analysis — all in 150-character format.',
  },
  {
    icon: '\u25D0',
    title: 'Recommendations Coach',
    desc:  'Build brag sheets for each recommender. AI drafts ask emails, tracks confirmation status, and ensures your recommender list covers every angle.',
  },
  {
    icon: '\u2B21',
    title: 'School List Builder',
    desc:  'Search 1,500+ colleges. Get chancing estimates, compare net prices, and track application status — reach, match, and safety all in one view.',
  },
  {
    icon: '\u25C6',
    title: 'Counselor Share Link',
    desc:  'Generate one link to share your essays, activities, school list, recommendations, and interview scores with counselors and parents. They don\'t need an account.',
  },
]

export default function Features() {
  return (
    <section style={{ padding: '100px 24px', maxWidth: 1440, margin: '0 auto' }}>
      <p style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#d4a84b', marginBottom: 12 }}>Platform Features</p>
      <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, marginBottom: 60, color: '#f2ede3' }}>
        Everything you need to <em style={{ fontStyle: 'italic', color: '#d4a84b' }}>ace</em> the interview
      </h2>
      <div className={styles.grid}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} style={{
            padding: '48px 40px',
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(242, 237, 227, 0.09)',
          }}>
            <div style={{
              width: 38, height: 38,
              border: '1px solid rgba(212, 168, 75, 0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#d4a84b', fontSize: 17, marginBottom: 28,
            }}>{icon}</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 23, fontWeight: 400, marginBottom: 14, color: '#f2ede3' }}>{title}</h3>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: 'rgba(242, 237, 227, 0.6)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
