import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS } from '../data'
import { Reveal, RollText, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'

function ProductCard({ p, i, onAdd }) {
  const [added, setAdded] = useState(false)
  const add = () => {
    if (added) return
    onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  return (
    <motion.article
      className="product"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease, delay: i * 0.1 }}
      whileHover="hover"
    >
      <div className="product-media">
        <motion.img
          src={p.img}
          alt={`${p.name}, ${p.material}`}
          loading="lazy"
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 1.2, ease }}
        />
        <motion.span
          className="product-quick"
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease }}
        >
          Quick view <Icon name="arrowUpRight" size={16} />
        </motion.span>
      </div>
      <div className="product-body">
        <h3 className="product-name">{p.name}</h3>
        <p className="product-meta">{p.material}</p>
        <p className="product-rating" aria-label={`Rated ${p.rating} out of 5`}>
          <span aria-hidden="true">★★★★★</span> {p.rating}
        </p>
        <div className="product-foot">
          <span className="product-price">${p.price}</span>
          <motion.button
            className={`btn btn--brand btn--sm add-btn ${added ? 'is-added' : ''}`}
            onClick={add}
            whileTap={{ scale: 0.9 }}
            aria-label={added ? `${p.name} added to cart` : `Add ${p.name} to cart`}
            aria-live="polite"
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
      </div>
    </motion.article>
  )
}

export default function BestSellers({ onAdd }) {
  return (
    <section className="section best" id="best-sellers">
      <div className="container">
        <div className="best-head">
          <div>
            <Reveal as="p" className="eyebrow" y={12}>Best-selling pieces</Reveal>
            <SplitText as="h2" className="h3" text="Worn by Our Community" />
            <Reveal as="p" className="lede" delay={0.2} y={16}>
              Our most-loved pieces, chosen for everyday wear and special occasions.
            </Reveal>
          </div>
          <Reveal delay={0.3} y={12}>
            <a href="#categories" className="link-underline">View All Jewellery</a>
          </Reveal>
        </div>
        <div className="products">
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} i={i} onAdd={onAdd} />)}
        </div>
      </div>
    </section>
  )
}
