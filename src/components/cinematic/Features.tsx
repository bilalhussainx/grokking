'use client'

import styles from './Features.module.css'

const FEATURES = [
  {
    icon: '\u25CE',
    title: 'AI Mock Interviews',
    desc:  'Voice-first interview practice with 10 role presets. Recruiter screens, technical rounds, system design, and behavioral — all with real-time AI feedback.',
  },
  {
    icon: '\u27E1',
    title: '17 Voice Languages',
    desc:  'Hindi, Spanish, French, Japanese, Bengali, Tamil, and 11 more. AI tutors trained on native speaker patterns with sub-second response time.',
  },
  {
    icon: '\u25C8',
    title: 'Career Pathways',
    desc:  '10 structured paths from Frontend to Finance. Each pathway groups courses, tracks your progress, and connects directly to mock interviews for that role.',
  },
  {
    icon: '\u25D0',
    title: 'Real-time Coaching',
    desc:  'Coach Kairos adapts explanations to your level. Get progressive hints, detailed breakdowns, and encouragement — all through voice or text.',
  },
  {
    icon: '\u2B21',
    title: '69+ Courses',
    desc:  'Coding interviews, system design, data structures, personal finance, philosophy, and more. Every course structured with checkpoints and exercises.',
  },
  {
    icon: '\u25C6',
    title: 'Interview Scorecard',
    desc:  'Get detailed feedback after every practice session. Communication clarity, technical depth, problem-solving approach — all scored and tracked over time.',
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
