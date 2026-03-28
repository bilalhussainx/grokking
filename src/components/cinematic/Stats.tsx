'use client'

import { useEffect, useRef } from 'react'
import styles from './Stats.module.css'

const STATS = [
  { id: 'cs1', target: 69,   suffix: '+',  label: 'Courses' },
  { id: 'cs2', target: 17,   suffix: '',   label: 'Languages' },
  { id: 'cs3', target: 10,   suffix: '',   label: 'Career Pathways' },
  { id: 'cs4', target: 2000, suffix: '+',  label: 'Lessons' },
]

function countUp(el: HTMLElement, target: number, suffix: string, durationMs: number) {
  let n = 0
  const step = target / (durationMs / 16)
  const interval = setInterval(() => {
    n = Math.min(n + step, target)
    el.textContent = Math.floor(n) + suffix
    if (n >= target) clearInterval(interval)
  }, 16)
}

export default function Stats() {
  const triggered = useRef(false)

  useEffect(() => {
    let ctx: { revert: () => void }

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: '#cine-stats',
          start: 'top 82%',
          onEnter: () => {
            if (triggered.current) return
            triggered.current = true
            STATS.forEach(({ id, target, suffix }, i) => {
              const el = document.getElementById(id)
              if (el) countUp(el, target, suffix, 1200 + i * 200)
            })
          },
        })
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <div id="cine-stats" className={styles.grid}>
      {STATS.map(({ id, target, suffix, label }) => (
        <div key={id} className={styles.item}>
          <span id={id} className={styles.num}>0{suffix}</span>
          <p className={styles.label}>{label}</p>
        </div>
      ))}
    </div>
  )
}
