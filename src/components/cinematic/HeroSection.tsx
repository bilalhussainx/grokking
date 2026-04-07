'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useNeuralCanvas } from '@/lib/useNeuralCanvas'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Live neural canvas
  useNeuralCanvas(canvasRef)

  // GSAP entrance + scroll parallax (client-only)
  useEffect(() => {
    let ctx: { revert: () => void }

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Entrance timeline — initial states set in CSS to avoid FOUC
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to('#he',         { opacity: 1, y: 0, duration: 1.1 },  0.2)
          .to('#hl1',        { y: '0%',          duration: 1.3 },  0.35)
          .to('#hl2',        { y: '0%',          duration: 1.3 },  0.5)
          .to('#hs',         { opacity: 1, y: 0, duration: 1.0 },  0.7)
          .to('#hc',         { opacity: 1, y: 0, duration: 0.9 },  0.85)
          .to('#scroll-ind', { opacity: 1, y: 0, duration: 0.8 },  1.1)

        // Scroll parallax
        const heroEl = document.getElementById('hero')

        gsap.to(canvasRef.current, {
          y: -160, ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top', end: 'bottom top', scrub: true,
          },
        })

        gsap.to(contentRef.current, {
          y: -90, opacity: 0.15, ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top', end: 'bottom top', scrub: true,
          },
        })
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      <div ref={contentRef} className={styles.content} id="hero-content">
        <p className={styles.eyebrow} id="he">Hindi · Tamil · Bengali · Punjabi · Spanish · Portuguese · 11 more</p>

        <h1 className={styles.headline}>
          <span className={styles.clipLine}>
            <span className={styles.clipInner} id="hl1">Practice tech interviews</span>
          </span>
          <span className={styles.clipLine}>
            <span className={styles.clipInner} id="hl2">
              in <em>your language.</em>
            </span>
          </span>
        </h1>

        <p className={styles.sub} id="hs">
          The only AI interview coach that speaks 17 languages. Practice frontend, backend, system design, and behavioral rounds with an AI that teaches you when you&apos;re stuck — in Hindi, Tamil, Spanish, or whatever language you think in. $10/mo.
        </p>

        <div className={styles.ctas} id="hc">
          <Link href="/interviews" className="cine-btn-primary">Try a Mock Interview — Free</Link>
          <Link href="/courses" className="cine-btn-outline">Browse 69+ Courses</Link>
        </div>
      </div>

      <div className={styles.scrollIndicator} id="scroll-ind" aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
