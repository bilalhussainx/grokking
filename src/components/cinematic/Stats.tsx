'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
  /** If true, render value as-is (no count-up). */
  staticLabel?: string
}

const STATS: Stat[] = [
  { value: 15, suffix: '+', label: 'Countries served' },
  { value: 120, suffix: '+', label: 'Active beta students' },
  { value: 10, label: 'Ivy+ alumni interviewer personas' },
  { value: 10, prefix: '$', suffix: '/mo', label: 'All Pro features unlocked' },
]

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])

  return <span ref={ref}>{value}</span>
}

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      style={{
        margin: '0 24px',
        padding: '80px 0',
        borderTop: '1px solid rgba(242, 237, 227, 0.09)',
        borderBottom: '1px solid rgba(242, 237, 227, 0.09)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}
    >
      {STATS.map(({ value, prefix, suffix, label }, i) => (
        <div
          key={label}
          style={{
            textAlign: 'center',
            padding: 20,
            borderRight:
              i < STATS.length - 1 ? '1px solid rgba(242, 237, 227, 0.09)' : 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(48px, 6vw, 84px)',
              fontWeight: 300,
              lineHeight: 1,
              color: '#d4a84b',
              display: 'block',
              marginBottom: 14,
            }}
          >
            {prefix}
            <AnimatedNumber target={value} />
            {suffix}
          </span>
          <p
            style={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(242, 237, 227, 0.6)',
            }}
          >
            {label}
          </p>
        </div>
      ))}
    </motion.div>
  )
}
