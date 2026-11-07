import { useEffect, useRef } from 'react'
import { IMG } from '../data'
import { Reveal } from '../components/motion'
import { gsap, prefersReducedMotion } from '../lib/smooth'

// Each line: array of words and inline image pills ({img}).
const LINES = [
  ['Every', 'piece', { img: IMG.hoops }, 'is', 'crafted', 'with', 'thoughtful', 'materials', 'and'],
  ['timeless', 'details,', { img: IMG.bracelet }, 'made', 'to', 'feel', 'effortlessly', 'like', 'you.'],
  ['From', 'quiet', 'mornings', 'to', 'your', 'brightest', 'moments,'],
  ['jewellery', 'becomes', 'part', 'of', 'your', 'daily', 'ritual.'],
]

export default function OurStory() {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // Read-along: words light up as the statement scrolls through the viewport.
      gsap.fromTo(
        '.story-word',
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.story-stmt', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.fromTo('.story-pill', { width: 0, marginInline: 0 }, {
        width: (i, el) => el.dataset.w,
        marginInline: '0.18em',
        ease: 'power2.out',
        scrollTrigger: { trigger: '.story-stmt', start: 'top 85%', end: 'top 45%', scrub: true },
      })
      gsap.to('.story-float--a', { yPercent: -45, rotate: -6, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } })
      gsap.to('.story-float--b', { yPercent: 40, rotate: 5, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } })
      gsap.from('.story-portrait', { scale: 0.6, rotate: -8, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section story tint" id="our-story" ref={root}>
      <div className="container story-inner">
        <img className="story-float story-float--a" src={IMG.pendant} alt="" loading="lazy" />
        <img className="story-float story-float--b" src={IMG.ring} alt="" loading="lazy" />

        <img className="story-portrait" src={IMG.hero} alt="" loading="lazy" />
        <Reveal as="p" className="eyebrow" y={10}>Our Story</Reveal>
        <p className="story-stmt">
          {LINES.map((line, li) => (
            <span className="story-line" key={li}>
              {line.map((w, wi) =>
                typeof w === 'string' ? (
                  <span key={wi} className="story-word">{w} </span>
                ) : (
                  <span key={wi} className="story-pill" data-w="2em" aria-hidden="true">
                    <img src={w.img} alt="" loading="lazy" />
                  </span>
                ),
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
