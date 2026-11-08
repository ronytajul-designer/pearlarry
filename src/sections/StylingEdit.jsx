import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { LOOKS } from '../data'
import { Reveal, SplitText, ease, RollText } from '../components/motion'
import Icon from '../components/Icon'
import { prefersReducedMotion } from '../lib/smooth'

/** Before/after slider. Drag anywhere, or use arrow keys on the handle. */
function Compare({ pair, delay = 0 }) {
  const box = useRef(null)
  const pos = useMotionValue(50)
  const clip = useMotionTemplate`inset(0 ${useTransform(pos, (v) => 100 - v)}% 0 0)`
  const left = useMotionTemplate`${pos}%`
  const [val, setVal] = useState(50)
  const hinted = useRef(false)

  useEffect(() => pos.on('change', (v) => setVal(Math.round(v))), [pos])

  const setFromX = (clientX) => {
    const r = box.current.getBoundingClientRect()
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }
  const onDown = (e) => {
    box.current.setPointerCapture(e.pointerId)
    pos.stop()
    setFromX(e.clientX)
  }
  const onMove = (e) => { if (e.buttons || e.pointerType === 'touch') { if (box.current.hasPointerCapture(e.pointerId)) setFromX(e.clientX) } }
  const onKey = (e) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft') { e.preventDefault(); animate(pos, Math.max(0, pos.get() - step), { duration: 0.3 }) }
    if (e.key === 'ArrowRight') { e.preventDefault(); animate(pos, Math.min(100, pos.get() + step), { duration: 0.3 }) }
  }
  // One-time "wiggle" hint so people know it's interactive.
  const hint = () => {
    if (hinted.current || prefersReducedMotion()) return
    hinted.current = true
    const seq = async () => {
      await animate(pos, 28, { duration: 0.9, ease, delay: 0.5 + delay })
      await animate(pos, 72, { duration: 1.1, ease })
      await animate(pos, 50, { duration: 0.9, ease })
    }
    seq()
  }

  return (
    <motion.div
      ref={box}
      className="compare"
      onPointerDown={onDown}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={hint}
      transition={{ duration: 1.1, ease, delay }}
    >
      <img src={pair.layered} alt={`${pair.alt}: layered`} style={{ objectPosition: pair.pos }} draggable="false" loading="lazy" />
      <motion.img src={pair.single} alt={`${pair.alt}: single`} className="compare-top" style={{ clipPath: clip, objectPosition: pair.pos }} draggable="false" loading="lazy" />
      <span className="compare-tag">Single</span>
      <span className="compare-tag compare-tag--dark">Layered</span>
      <motion.div className="compare-line" style={{ left }}>
        <button
          className="compare-handle"
          role="slider"
          aria-label="Compare single and layered styling"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={val}
          onKeyDown={onKey}
        >
          <Icon name="arrows" size={22} stroke={1.8} />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function StylingEdit() {
  const [tab, setTab] = useState(LOOKS[0].id)
  const look = LOOKS.find((l) => l.id === tab)

  return (
    <section className="section styling tint" id="styling">
      <div className="container">
        <div className="center-head styling-head">
          <Reveal as="p" className="eyebrow" y={10}>The Styling Edit</Reveal>
          <SplitText as="h2" className="h3" text={['One piece or layered:', 'find your Pearlarry style']} />
          <Reveal as="p" className="lede" delay={0.2} y={16}>
            Keep it simple or add a little more shine. Explore two ways to style your everyday jewellery.
          </Reveal>
        </div>

        <Reveal className="tabs-wrap" delay={0.1} y={16}>
          <div className="tabs" role="tablist" aria-label="Styling looks">
            {LOOKS.map((l) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={tab === l.id}
                className={`tab ${tab === l.id ? 'is-active' : ''}`}
                onClick={() => setTab(l.id)}
              >
                {tab === l.id && (
                  <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                )}
                <span className="tab-label">{l.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="compare-grid"
            role="tabpanel"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease }}
          >
            {look.pairs.map((p, i) => <Compare key={i} pair={p} delay={i * 0.12} />)}
          </motion.div>
        </AnimatePresence>

        <Reveal className="center" y={16}>
            <Link to="/shop" className="btn btn--brand"><RollText text="Shop the Looks" /></Link>
        </Reveal>
      </div>
    </section>
  )
}
