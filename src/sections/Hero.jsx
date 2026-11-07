import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { IMG } from '../data'
import { SplitText, ease, RollText } from '../components/motion'
import { gsap, prefersReducedMotion, useScrollTo } from '../lib/smooth'

export default function Hero({ ready }) {
  const root = useRef(null)
  const scrollTo = useScrollTo()

  // Scroll-out choreography: image drifts down & zooms, copy lifts and fades, panel tucks in.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-img-wrap', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-copy', { yPercent: -60, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } })
      gsap.to('.hero-panel', { scale: 0.94, borderRadius: 40, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <motion.div
        className="hero-panel"
        initial={{ clipPath: 'inset(12% 8% 12% 8% round 32px)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 20px)' } : undefined}
        transition={{ duration: 1.6, ease }}
      >
        <div className="hero-img-wrap">
        <motion.img
          className="hero-img"
          src={IMG.hero}
          alt="Gold hoops, a fine chain bracelet and stacked rings resting on ivory silk and travertine"
          initial={{ scale: 1.35 }}
          animate={ready ? { scale: 1 } : undefined}
          transition={{ duration: 2.2, ease }}
          fetchPriority="high"
        />
        </div>
        <div className="hero-shade" />

        <div className="hero-copy hero-top">
          <motion.p
            className="eyebrow eyebrow--accent"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
          >
            Jewellery
          </motion.p>
          <SplitText as="h1" className="hero-title" text={['Your Everyday,', 'Elevated']} play={ready} delay={0.6} stagger={0.09} />
        </div>

        <div className="hero-copy hero-bottom">
          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 1 }}
          >
            Thoughtful details. Timeless designs. Discover jewellery that feels polished, personal, and made for every day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 1.15 }}
          >
              <a href="#best-sellers" className="btn btn--light" onClick={(e) => { e.preventDefault(); scrollTo('#best-sellers') }}>
                <RollText text="Shop Now" />
              </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
