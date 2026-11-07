import { useEffect, useRef } from 'react'
import { FOOTER } from '../data'
import { gsap, prefersReducedMotion, useScrollTo } from '../lib/smooth'
import { Magnetic } from '../components/motion'

export default function Footer() {
  const root = useRef(null)
  const scrollTo = useScrollTo()

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.wm-char', {
        yPercent: 100,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: { trigger: '.wordmark', start: 'top bottom', end: 'bottom 85%', scrub: 0.6 },
      })
      gsap.from('.foot-col', {
        y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={root}>
      <div className="container">
        <div className="foot-top">
          <div className="foot-brand">
            <p className="foot-logo">Pearlarry</p>
            <p>A relationship between you and your style, between timeless design and modern wearability, between beauty and thoughtful craft.</p>
          </div>
          <nav className="foot-links" aria-label="Footer">
            {FOOTER.map((c) => (
              <div className="foot-col" key={c.title}>
                <p className="foot-h">{c.title}</p>
                <ul>
                  {c.links.map((l) => (
                    <li key={l}><a href="#top" className="foot-link">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="wordmark" aria-hidden="true">
          {'Pearlarry'.split('').map((c, i) => <span className="wm-mask" key={i}><span className="wm-char">{c}</span></span>)}
        </p>

        <div className="foot-bottom">
          <p>© 2026 Pearlarry. All rights reserved.</p>
          <Magnetic>
            <button className="btn btn--light btn--sm" onClick={() => scrollTo(0, { duration: 2.2 })}>
              <span className="btn-roll" data-text="Back to top ↑">Back to top ↑</span>
            </button>
          </Magnetic>
          <p className="foot-legal"><a href="#top">Terms</a> · <a href="#top">Privacy</a></p>
        </div>
      </div>
    </footer>
  )
}
