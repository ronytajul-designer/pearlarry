import { createContext, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RollText, ease } from './motion'
import Icon from './Icon'
import { useCart, useToast } from '../lib/store'
import { money } from '../products'

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay } }),
}

/**
 * Horizontal rows (home best sellers, related, cart) use <ProductRow>: the row enters view as one,
 * so cards that start off-screen inside a swipe carousel are already visible when swiped to.
 */
const RowInView = createContext(null)

// The card is its own variant controller (it uses whileHover="hover"), so it can't inherit variant
// labels from a parent. The row shares its in-view state through context instead.
export function ProductRow({ children, className = 'products' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <div ref={ref} className={className}>
      <RowInView.Provider value={inView}>{children}</RowInView.Provider>
    </div>
  )
}

/** One product card for every grid on the site (home, shop, PDP, cart, wishlist). */
export default function ProductCard({ p, i = 0, variant = '', group = false }) {
  const cart = useCart()
  const toast = useToast()
  const rowInView = useContext(RowInView)
  const [added, setAdded] = useState(false)
  const add = () => {
    if (added) return
    cart.add(p.id, p.option?.default ?? null)
    toast(`${p.name} added to your bag`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  return (
    <motion.article
      className={`product ${variant}`}
      variants={cardVariants}
      custom={(group ? i : i % 4) * 0.08}
      initial="hidden"
      {...(group ? { animate: rowInView ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once: true, amount: 0.2 } })}
      whileHover="hover"
    >
      <Link to={`/product/${p.id}`} className="product-link" aria-label={`${p.name}, ${money(p.price)}`}>
        <div className="product-media">
          <motion.img src={p.img} alt="" loading="lazy" variants={{ hover: { scale: 1.08 } }} transition={{ duration: 1.2, ease }} />
          {p.compareAt && <span className="product-flag">−{Math.round((1 - p.price / p.compareAt) * 100)}%</span>}
          <motion.span className="product-quick" variants={{ hover: { opacity: 1, y: 0 } }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.4, ease }}>
            View piece <Icon name="arrowUpRight" size={16} />
          </motion.span>
        </div>
        <div className="product-body">
          <h3 className="product-name">{p.name}</h3>
          <p className="product-meta">{p.material}</p>
          <p className="product-rating" aria-label={`Rated ${p.rating} out of 5`}>
            <span aria-hidden="true">★★★★★</span> {p.rating}
          </p>
        </div>
      </Link>
      <div className="product-foot">
        <span className="product-price">
          {money(p.price)}
          {p.compareAt && <s className="product-was">{money(p.compareAt)}</s>}
        </span>
        <motion.button
          className={`btn btn--brand btn--sm add-btn ${added ? 'is-added' : ''}`}
          onClick={add}
          whileTap={{ scale: 0.9 }}
          aria-label={added ? `${p.name} added to bag` : `Add ${p.name} to bag`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" className="add-inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                <Icon name="check" size={16} stroke={2.2} /> Added
              </motion.span>
            ) : (
              <motion.span key="add" className="add-inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                <RollText text="Add" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  )
}
