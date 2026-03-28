'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import styles from './CTASection.module.css'

export default function CTASection() {
  useEffect(() => {
    let ctx: { revert: () => void }

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set('.' + styles.title, { opacity: 0, y: 56 })

        ScrollTrigger.create({
          trigger: '#cine-cta',
          start: 'top 78%',
          onEnter: () => {
            gsap.to('.' + styles.title, {
              opacity: 1, y: 0, duration: 1.3, ease: 'power3.out',
            })
            gsap.from('.' + styles.ctas, {
              opacity: 0, y: 28, duration: 0.9, delay: 0.35, ease: 'power2.out',
            })
          },
        })
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="cine-cta" className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.line} aria-hidden="true" />

      <p className={`cine-sec-label ${styles.eyebrow}`}>Begin Today</p>

      <h2 className={styles.title}>
        Ready to ace your<br />
        next <em>interview?</em>
      </h2>

      <div className={styles.ctas}>
        <Link href="/signup" className="cine-btn-primary">
          Create Free Account
        </Link>
      </div>
    </section>
  )
}
