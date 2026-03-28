'use client'

import { useEffect, useRef } from 'react'
import styles from './ScrollSequence.module.css'

const PANELS = [
  {
    id:  'seq-p1',
    num: '01 — The Interview',
    heading: <>Practice with AI that <em>teaches</em></>,
    body:
      'Our AI interviewer adapts to your level, asks role-specific questions, and teaches you when you\'re stuck. Recruiter screens, technical rounds, system design — all voice-first.',
    visual: 'pulse',
  },
  {
    id:  'seq-p2',
    num: '02 — The Voice',
    heading: <>Learn in your <em>language</em></>,
    body:
      'Real-time voice tutoring in 17 languages. Hindi, Spanish, French, Japanese, and 13 more. Sub-second response time with AI tutors that speak like natives.',
    visual: 'langs',
  },
  {
    id:  'seq-p3',
    num: '03 — The Path',
    heading: <>Courses that lead <em>somewhere</em></>,
    body:
      '10 career pathways from Frontend to ML/AI. Each pathway groups courses, tracks progress, and connects to mock interviews for that role.',
    visual: 'path',
  },
]

const LANGS = ['Hindi', 'Espa\u00f1ol', 'Fran\u00e7ais', 'Japanese', 'Bengali', 'Tamil', 'Punjabi']

function PulseVisual() {
  return (
    <div className={styles.pulseWrap}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={styles.pRing} style={{ animationDelay: `${(i - 1) * 0.6}s` }} />
      ))}
      <div className={styles.pCore} />
    </div>
  )
}

function LangsVisual() {
  return (
    <div className={styles.langWrap}>
      {LANGS.map((lang, i) => (
        <div
          key={lang}
          className={`${styles.langPill} ${lang === 'Hindi' ? styles.langGold : ''}`}
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          {lang}
        </div>
      ))}
    </div>
  )
}

function PathVisual() {
  return (
    <div className={styles.pathWrap}>
      <svg width="300" height="280" viewBox="0 0 300 280" fill="none" aria-hidden="true">
        <path d="M30 250 C80 210 120 180 150 140 C180 100 210 70 270 35"
          stroke="rgba(212,168,75,0.35)" strokeWidth="1.5" strokeDasharray="5 5"/>
        <path d="M80 205 C90 185 105 165 120 155"
          stroke="rgba(212,168,75,0.18)" strokeWidth="1" strokeDasharray="3 4"/>
        <path d="M180 100 C195 88 210 82 225 74"
          stroke="rgba(212,168,75,0.14)" strokeWidth="1" strokeDasharray="3 4"/>
        <circle cx="30"  cy="250" r="7"  fill="#d4a84b" opacity="0.9"/>
        <circle cx="30"  cy="250" r="13" fill="rgba(212,168,75,0.18)"/>
        <circle cx="150" cy="140" r="6"  fill="#d4a84b" opacity="0.6"/>
        <circle cx="150" cy="140" r="11" fill="rgba(212,168,75,0.12)"/>
        <circle cx="270" cy="35"  r="5"  fill="#d4a84b" opacity="0.35"/>
        <circle cx="270" cy="35"  r="9"  fill="rgba(212,168,75,0.08)"/>
        <text x="50"  y="255" fill="rgba(212,168,75,0.6)" fontSize="10" fontWeight="300">Frontend</text>
        <text x="162" y="145" fill="rgba(212,168,75,0.5)" fontSize="10" fontWeight="300">Full Stack</text>
        <text x="238" y="32"  fill="rgba(212,168,75,0.4)" fontSize="10" fontWeight="300">ML/AI</text>
        <circle cx="90"  cy="198" r="3.5" fill="rgba(212,168,75,0.28)"/>
        <circle cx="113" cy="162" r="3"   fill="rgba(212,168,75,0.2)"/>
        <circle cx="195" cy="87"  r="3.5" fill="rgba(212,168,75,0.2)"/>
        <circle cx="222" cy="74"  r="3"   fill="rgba(212,168,75,0.15)"/>
      </svg>
    </div>
  )
}

const VISUAL_MAP = { pulse: PulseVisual, langs: LangsVisual, path: PathVisual }

export default function ScrollSequence() {
  const sectionRef    = useRef<HTMLElement>(null)
  const activePanelRef = useRef(0)

  useEffect(() => {
    let ctx: { revert: () => void }

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const panelIds  = ['seq-p1', 'seq-p2', 'seq-p3']
        const dotIds    = ['d1', 'd2', 'd3']

        // Hide panels 2 & 3 initially
        gsap.set('#seq-p2', { opacity: 0, y: 44, pointerEvents: 'none' })
        gsap.set('#seq-p3', { opacity: 0, y: 44, pointerEvents: 'none' })

        const switchTo = (idx: number) => {
          const prev = activePanelRef.current
          if (idx === prev) return
          activePanelRef.current = idx

          gsap.to('#' + panelIds[prev], {
            opacity: 0, y: prev < idx ? -40 : 40,
            duration: 0.55, ease: 'power2.in', pointerEvents: 'none',
          })
          gsap.to('#' + panelIds[idx], {
            opacity: 1, y: 0,
            duration: 0.65, ease: 'power2.out', delay: 0.1, pointerEvents: 'auto',
          })

          dotIds.forEach((d, i) => {
            const el = document.getElementById(d)
            if (el) el.classList.toggle(styles.dotOn, i === idx)
          })
        }

        let prevBucket = -1
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress
            const bucket = p < 0.33 ? 0 : p < 0.66 ? 1 : 2
            if (bucket !== prevBucket) { prevBucket = bucket; switchTo(bucket) }
          },
        })
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id="scroll-sequence" className={styles.section}>
      {PANELS.map(({ id, num, heading, body, visual }) => {
        const Visual = VISUAL_MAP[visual as keyof typeof VISUAL_MAP]
        return (
          <div key={id} id={id} className={styles.panel}>
            <div className={styles.inner}>
              <div className={styles.text}>
                <p className={styles.num}>{num}</p>
                <h2>{heading}</h2>
                <p>{body}</p>
              </div>
              <div className={styles.visual}>
                <Visual />
              </div>
            </div>
          </div>
        )
      })}

      {/* Progress dots */}
      <div className={styles.dots} aria-hidden="true">
        {['d1','d2','d3'].map((d, i) => (
          <div key={d} id={d} className={`${styles.dot} ${i === 0 ? styles.dotOn : ''}`} />
        ))}
      </div>
    </section>
  )
}
