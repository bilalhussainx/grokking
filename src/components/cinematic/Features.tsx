'use client'

import { useEffect } from 'react'
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
    desc:  'Coach Alex adapts explanations to your level. Get progressive hints, detailed breakdowns, and encouragement — all through voice or text.',
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
  useEffect(() => {
    let ctx: { revert: () => void }

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: '#cine-features',
          start: 'top 72%',
          onEnter: () =>
            gsap.to('.' + styles.card, {
              opacity: 1, y: 0,
              stagger: 0.1, duration: 0.85, ease: 'power2.out',
            }),
        })
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="cine-features" className={styles.section}>
      <p className="cine-sec-label">Platform Features</p>
      <h2 className="cine-sec-title">
        Everything you need to <em>ace</em> the interview
      </h2>
      <div className={styles.grid}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className={styles.card}>
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.desc}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
