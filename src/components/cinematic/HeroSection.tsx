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
        // Entrance timeline
        gsap.set(['#he', '#hs', '#hc', '#scroll-ind'], { opacity: 0, y: 18 })
        gsap.set(['#hl1', '#hl2'], { y: '105%' })

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to('#he',         { opacity: 1, y: 0, duration: 1.1 },  0.5)
          .to('#hl1',        { y: '0%',          duration: 1.3 },  0.7)
          .to('#hl2',        { y: '0%',          duration: 1.3 },  0.88)
          .to('#hs',         { opacity: 1, y: 0, duration: 1.0 },  1.1)
          .to('#hc',         { opacity: 1, y: 0, duration: 0.9 },  1.25)
          .to('#scroll-ind', { opacity: 1, y: 0, duration: 0.8 },  1.5)

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
        <p className={styles.eyebrow} id="he">AI Interview Coach & Voice Tutor</p>

        <h1 className={styles.headline}>
          <span className={styles.clipLine}>
            <span className={styles.clipInner} id="hl1">Ace your next</span>
          </span>
          <span className={styles.clipLine}>
            <span className={styles.clipInner} id="hl2">
              <em>interview.</em>
            </span>
          </span>
        </h1>

        <p className={styles.sub} id="hs">
          Practice mock interviews and learn in 17&nbsp;languages with real-time AI voice coaching.
          Career pathways for every tech role.
        </p>

        <div className={styles.ctas} id="hc">
          <Link href="/signup" className="cine-btn-primary">Start Mock Interview</Link>
          <Link href="/pathways" className="cine-btn-outline">Explore Career Pathways</Link>
        </div>
      </div>

      <div className={styles.scrollIndicator} id="scroll-ind" aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
