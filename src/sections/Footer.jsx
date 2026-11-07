import { useEffect, useLayoutEffect, useRef } from 'react'
import { FOOTER } from '../data'
import { gsap, prefersReducedMotion, useScrollTo } from '../lib/smooth'
import { Magnetic, RollText } from '../components/motion'

export default function Footer() {
  const root = useRef(null)
  const scrollTo = useScrollTo()
  const mark = useRef(null)

  // Fit the wordmark edge to edge inside the container at any viewport width.
  useLayoutEffect(() => {
    const el = mark.current
    const fit = () => {
      el.style.fontSize = '100px'
      const avail = el.parentElement.clientWidth - parseFloat(getComputedStyle(el.parentElement).paddingLeft) * 2
      const chars = el.children
      const textW = chars[chars.length - 1].getBoundingClientRect().right - chars[0].getBoundingClientRect().left
      el.style.fontSize = `${(100 * avail * 0.97) / textW}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.wm-char', {
        yPercent: 55,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.07,
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

        <p className="wordmark" aria-hidden="true" ref={mark}>
          {'Pearlarry'.split('').map((c, i) => <span className="wm-char" key={i}>{c}</span>)}
        </p>

        <div className="foot-bottom">
          <p>© 2026 Pearlarry. All rights reserved.</p>
          <Magnetic>
            <button className="btn btn--light btn--sm" onClick={() => scrollTo(0, { duration: 2.2 })}>
              <RollText text="Back to top ↑" />
            </button>
          </Magnetic>
          <p className="foot-legal"><a href="#top">Terms</a> · <a href="#top">Privacy</a></p>
        </div>
      </div>
    </footer>
  )
}
