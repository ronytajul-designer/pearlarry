import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RollText, SplitText, ease } from '../components/motion'
import { useReady } from '../lib/store'

export default function NotFound() {
  const ready = useReady()
  const a = (d) => ({ initial: { opacity: 0, y: 18 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.8, ease, delay: d } })
  return (
    <section className="notfound tint">
      <div className="container center-head">
        <motion.p className="eyebrow nf-eyebrow" {...a(0.05)}>Error 404</motion.p>
        <div className="nf-num" aria-hidden="true">
          {['4', '0', '4'].map((c, i) => (
            <span className="split-mask" key={i}>
              <motion.span className="nf-digit" initial={{ y: '140%' }} animate={ready ? { y: 0 } : undefined} transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.1 }}>
                {c}
                {i === 1 && (
                  <motion.i className="nf-gem" initial={{ scale: 0, rotate: 0 }} animate={ready ? { scale: 1, rotate: 45 } : undefined} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.7 }} />
                )}
              </motion.span>
            </span>
          ))}
        </div>
        <SplitText as="h1" className="h3" text="Page not found" play={ready} delay={0.35} />
        <motion.p className="lede nf-lede" {...a(0.5)}>
          This page seems to have slipped away. Discover rings, necklaces, earrings, and bracelets to find your next favourite piece.
        </motion.p>
        <motion.div className="btn-row" {...a(0.6)}>
          <Link to="/" className="btn btn--brand"><RollText text="Back to home" /></Link>
          <Link to="/shop" className="btn btn--light"><RollText text="Shop jewellery" /></Link>
        </motion.div>
      </div>
    </section>
  )
}
