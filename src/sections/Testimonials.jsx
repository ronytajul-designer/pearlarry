import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { TESTIMONIALS } from '../data'
import { Reveal, SplitText, ease } from '../components/motion'

const N = TESTIMONIALS.length
const LOOP = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS] // infinite illusion

export default function Testimonials() {
  const viewport = useRef(null)
  const track = useRef(null)
  const x = useMotionValue(0)
  const [index, setIndex] = useState(N) // start in the middle copy
  const [metrics, setMetrics] = useState({ step: 0, offset: 0 })
  const paused = useRef(false)

  const measure = useCallback(() => {
    const card = track.current?.children[0]
    if (!card) return
    const gap = parseFloat(getComputedStyle(track.current).columnGap) || 24
    const w = card.getBoundingClientRect().width
    const vw = viewport.current.getBoundingClientRect().width
    setMetrics({ step: w + gap, offset: (vw - w) / 2 })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [measure])

  const target = (i) => metrics.offset - i * metrics.step

  // Snap instantly when metrics change (resize) to avoid drift.
  useEffect(() => { x.set(target(index)) }, [metrics]) // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((next) => {
    setIndex(next)
    animate(x, metrics.offset - next * metrics.step, {
      type: 'spring', stiffness: 140, damping: 26,
      onComplete: () => {
        // Teleport back into the middle copy without a visible jump.
        if (next < N || next >= 2 * N) {
          const norm = ((next % N) + N) % N + N
          setIndex(norm)
          x.set(metrics.offset - norm * metrics.step)
        }
      },
    })
  }, [metrics, x])

  // Autoplay, paused on hover/focus/drag.
  useEffect(() => {
    const t = setInterval(() => { if (!paused.current && !document.hidden) go(index + 1) }, 5000)
    return () => clearInterval(t)
  }, [index, go])

  const onDragEnd = (_, info) => {
    const swipe = info.offset.x + info.velocity.x * 0.2
    const moved = Math.round(-swipe / metrics.step)
    go(index + (moved || (Math.abs(swipe) > 40 ? -Math.sign(swipe) : 0)))
    paused.current = false
  }

  const active = index % N

  return (
    <section className="section testi" id="testimonials">
      <div className="center-head container">
        <Reveal as="p" className="eyebrow" y={10}>Styling Notes</Reveal>
        <SplitText as="h2" className="h3 testi-title" text={['What our customers', 'are wearing']} />
      </div>

      <div
        className="testi-viewport"
        ref={viewport}
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        aria-roledescription="carousel"
      >
        <motion.div
          className="testi-track"
          ref={track}
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => (paused.current = true)}
          onDragEnd={onDragEnd}
        >
          {LOOP.map((t, i) => {
            const isActive = i === index
            return (
              <motion.article
                key={i}
                className="testi-card"
                animate={{ opacity: isActive ? 1 : 0.55, scale: isActive ? 1 : 0.94 }}
                transition={{ duration: 0.7, ease }}
                aria-hidden={!isActive}
              >
                <div className="testi-img"><img src={t.img} alt="" draggable="false" loading="lazy" /></div>
                <div className="testi-text">
                  <p className="stars" aria-label="5 out of 5 stars">★★★★★</p>
                  <h3 className="testi-headline">{t.title}</h3>
                  <p className="testi-quote">“{t.quote}”</p>
                  <p className="testi-attr"><strong>— {t.name}</strong> <span>{t.place}</span></p>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>

      <div className="dots" role="tablist" aria-label="Choose testimonial">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={active === i}
            aria-label={`Show review from ${t.name}`}
            className="dot"
            onClick={() => go(N + i)}
          >
            <motion.span animate={{ width: active === i ? 30 : 8, backgroundColor: active === i ? '#91220f' : '#dcd1cc' }} transition={{ duration: 0.5, ease }} />
          </button>
        ))}
      </div>
    </section>
  )
}
