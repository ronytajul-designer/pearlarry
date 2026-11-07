import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/smooth'

export const ease = [0.22, 1, 0.36, 1] // expo-ish out, feels "jewellery" calm

/** Words rise out of a mask when scrolled into view (or when `play` flips true). */
export function SplitText({ text, as = 'span', className, delay = 0, stagger = 0.06, play, once = true }) {
  const Tag = motion[as]
  const lines = Array.isArray(text) ? text : [text]
  const controlled = play !== undefined
  const starts = lines.reduce((acc, l, i) => [...acc, i ? acc[i - 1] + lines[i - 1].split(' ').length : 0], [])
  return (
    <Tag
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: play ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once, amount: 0.6 } })}
      aria-label={lines.join(' ')}
    >
      {lines.map((line, li) => (
        <span key={li} className="split-line" aria-hidden="true">
          {line.split(' ').map((w, i) => {
            const idx = starts[li] + i
            return (
              <span key={i}>
                <span className="split-mask">
                  <motion.span
                    className="split-word"
                    variants={{
                      hidden: { y: '110%', rotate: 4 },
                      show: { y: '0%', rotate: 0, transition: { duration: 1, ease, delay: delay + idx * stagger } },
                    }}
                  >
                    {w}
                  </motion.span>
                </span>{' '}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

/** Generic fade-up on enter. */
export function Reveal({ children, delay = 0, y = 32, className, as = 'div', amount = 0.3, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Image that unmasks with clip-path, then drifts on scroll (GSAP scrub parallax). */
export function ParallaxImg({ src, alt = '', className, speed = 12, reveal = true, imgClass, eager }) {
  const wrap = useRef(null)
  const img = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, wrap)
    return () => ctx.revert()
  }, [speed])
  return (
    <motion.div
      ref={wrap}
      className={`pimg ${className || ''}`}
      initial={reveal ? { clipPath: 'inset(18% 10% 18% 10% round 24px)' } : false}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, ease }}
    >
      <img
        ref={img}
        src={src}
        alt={alt}
        className={imgClass}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{ height: `${100 + speed}%`, top: `-${speed / 2}%` }}
      />
    </motion.div>
  )
}

/** Button label: letters roll up one after another on hover (pure CSS, staggered via --i). */
export function RollText({ text }) {
  const chars = [...text]
  const row = (hidden) => (
    <span className="roll-row" aria-hidden={hidden || undefined}>
      {chars.map((c, i) => (
        <span key={i} className="roll-char" style={{ '--i': i }}>{c === ' ' ? '\u00a0' : c}</span>
      ))}
    </span>
  )
  return (
    <span className="roll" aria-label={text}>
      <span className="roll-track" aria-hidden="true">{row()}{row(true)}</span>
    </span>
  )
}
