import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { TESTIMONIALS } from '../data'
import { Reveal, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'
import { prefersReducedMotion } from '../lib/smooth'

const AUTOPLAY = 6 // seconds per review

const N = TESTIMONIALS.length
const LOOP = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS] // infinite illusion

export default function Testimonials() {
  const viewport = useRef(null)
  const track = useRef(null)
  const x = useMotionValue(0)
  const [index, setIndex] = useState(N) // start in the middle copy
  const [metrics, setMetrics] = useState({ step: 0, offset: 0 })
  const [paused, setPaused] = useState(false)
  const progress = useMotionValue(0)

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
    progress.set(0)
    setIndex(next)
    animate(x, metrics.offset - next * metrics.step, {
      duration: 0.8, ease, // tween, no overshoot
      onComplete: () => {
        // Teleport back into the middle copy without a visible jump.
        if (next < N || next >= 2 * N) {
          const norm = ((next % N) + N) % N + N
          setIndex(norm)
          x.set(metrics.offset - norm * metrics.step)
        }
      },
    })
  }, [metrics, x, progress])

  // Autoplay drives a progress value so the active bar visibly fills; pauses on hover, focus or drag.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return
    const remaining = AUTOPLAY * (1 - progress.get())
    const c = animate(progress, 1, { duration: remaining, ease: 'linear', onComplete: () => go(index + 1) })
    return () => c.stop()
  }, [index, paused, go, progress])

  const onDragEnd = (_, info) => {
    const swipe = info.offset.x + info.velocity.x * 0.2
    const moved = Math.round(-swipe / metrics.step)
    go(index + (moved || (Math.abs(swipe) > 40 ? -Math.sign(swipe) : 0)))
    setPaused(false)
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
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        aria-roledescription="carousel"
      >
        <motion.div
          className="testi-track"
          ref={track}
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
        >
          {LOOP.map((t, i) => {
            const isActive = i === index
            return (
              <motion.article
                key={i}
                className="testi-card"
                animate={{ opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.7, ease }}
                aria-hidden={!isActive}
                onTap={() => !isActive && go(i)}
                style={{ cursor: isActive ? 'grab' : 'pointer' }}
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

      <div
        className="testi-controls container"
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <button className="testi-arrow" onClick={() => go(index - 1)} aria-label="Previous review">
          <Icon name="arrowRight" size={20} style={{ transform: 'scaleX(-1)' }} />
        </button>

        <div className="testi-progress" role="tablist" aria-label="Choose review">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              role="tab"
              aria-selected={active === i}
              aria-label={`Review ${i + 1} of ${N}: ${t.name}`}
              className={`seg ${active === i ? 'is-active' : ''}`}
              onClick={() => go(N + i)}
            >
              <span className="seg-name">{t.name}</span>
              <span className="seg-track">
                <motion.span className="seg-fill" style={{ scaleX: active === i ? progress : i < active ? 1 : 0 }} />
              </span>
            </button>
          ))}
        </div>

        <span className="testi-count" aria-live="polite">
          <strong>{String(active + 1).padStart(2, '0')}</strong> / {String(N).padStart(2, '0')}
        </span>

        <button className="testi-arrow" onClick={() => go(index + 1)} aria-label="Next review">
          <Icon name="arrowRight" size={20} />
        </button>
      </div>
    </section>
  )
}
