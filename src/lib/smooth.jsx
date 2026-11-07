import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisCtx = createContext(null)
export const useLenis = () => useContext(LenisCtx)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children, paused }) {
  const [lenis, setLenis] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true })
    ref.current = l
    l.on('scroll', ScrollTrigger.update)
    const raf = (t) => l.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)
    return () => {
      gsap.ticker.remove(raf)
      l.destroy()
      ref.current = null
    }
  }, [])

  useEffect(() => {
    const l = ref.current
    if (!l) return
    if (paused) l.stop()
    else l.start()
    document.documentElement.style.overflow = paused ? 'hidden' : ''
  }, [paused, lenis])

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}

/** Scroll to a selector/element/number using Lenis when available. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target, opts = {}) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: -80, ...opts })
    else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' })
      else el?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export { gsap, ScrollTrigger }
