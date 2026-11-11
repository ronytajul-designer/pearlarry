import { useEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'

/** Short brand intro (~1.6s). Kept brief on purpose: long preloaders cost bounce rate. */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone }, [onDone])
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => done.current() })
      tl.from('.pl-char', { yPercent: 150, rotate: 6, duration: 0.9, ease: 'expo.out', stagger: 0.04 })
        .fromTo('.pl-bar span', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1)
        .to('.pl-char', { yPercent: -150, duration: 0.6, ease: 'expo.in', stagger: 0.02 }, '+=0.1')
        .to('.pl-bar', { opacity: 0, duration: 0.3 }, '<')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.25')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-word">
        {'Pearlarry'.split('').map((c, i) => (
          <span key={i} className="pl-mask"><span className="pl-char">{c}</span></span>
        ))}
      </div>
      <div className="pl-bar"><span /></div>
    </div>
  )
}
