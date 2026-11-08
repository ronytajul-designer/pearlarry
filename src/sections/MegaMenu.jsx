import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IMG } from '../images'
import { PRODUCTS, countIn, getProduct, money } from '../products'
import Icon from '../components/Icon'
import { ease } from '../components/motion'

const q = (k, v) => `/shop?${k}=${encodeURIComponent(v)}`

export const MEGA_CATEGORIES = [
  { name: 'Rings', img: IMG.ring, blurb: 'Stackable bands and signet styles', to: q('category', 'Rings') },
  { name: 'Necklaces', img: IMG.pendant, blurb: 'Pendants made to layer', to: q('category', 'Necklaces') },
  { name: 'Earrings', img: IMG.hoops, blurb: 'Hoops and huggies for every day', to: q('category', 'Earrings') },
  { name: 'Bracelets', img: IMG.bracelet, blurb: 'Fine chains, adjustable fit', to: q('category', 'Bracelets') },
]

const EDITS = [
  ['Everyday Edit', q('category', 'Everyday Edit'), PRODUCTS.filter((p) => p.tags.includes('everyday')).length],
  ['Gifts', q('category', 'Gifts'), PRODUCTS.filter((p) => p.tags.includes('gift')).length],
  ['Under $25', q('price', 'Under $25'), PRODUCTS.filter((p) => p.price < 25).length],
  ['Top rated', q('sort', 'Top rated')],
]

const METALS = ['14k Gold Vermeil', '18k Gold Plated', 'Sterling Silver']
const FEATURED = getProduct('radiance-pendant')

const list = { show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }

/** Desktop "Our Jewellery" panel. Hovering a category swaps the preview image. */
export default function MegaMenu({ onNavigate, onEnter, onLeave }) {
  const [hover, setHover] = useState(0)
  const cat = MEGA_CATEGORIES[hover]
  return (
    <motion.div
      className="mega"
      id="mega-menu"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0 round 0 0 24px 24px)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 0 0 24px 24px)' }}
      exit={{ opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0 round 0 0 24px 24px)', pointerEvents: 'none' }}
      transition={{ duration: 0.45, ease }}
    >
      <motion.div className="container mega-grid" variants={list} initial="hidden" animate="show">
        <div className="mega-col">
          <motion.p className="mega-h" variants={item}>Shop by category</motion.p>
          <ul className="mega-cats">
            {MEGA_CATEGORIES.map((c, i) => (
              <motion.li key={c.name} variants={item}>
                <Link
                  to={c.to}
                  className={`mega-cat ${hover === i ? 'is-on' : ''}`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onClick={onNavigate}
                >
                  <img src={c.img} alt="" />
                  <span><strong>{c.name}</strong><small>{c.blurb}</small></span>
                  <em>{countIn(c.name)}</em>
                  <Icon name="arrowRight" size={16} className="mega-cat-arrow" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mega-col mega-col--links">
          <motion.p className="mega-h" variants={item}>Edits</motion.p>
          <ul className="mega-links">
            {EDITS.map(([label, to, n]) => (
              <motion.li key={label} variants={item}>
                <Link to={to} onClick={onNavigate}>{label}{n !== undefined && <small>{n}</small>}</Link>
              </motion.li>
            ))}
          </ul>
          <motion.p className="mega-h mega-h--gap" variants={item}>Materials</motion.p>
          <ul className="mega-links">
            {METALS.map((m) => (
              <motion.li key={m} variants={item}>
                <Link to={q('material', m)} onClick={onNavigate}>
                  <i className={`metal-dot metal-dot--${m.startsWith('Sterling') ? 'silver' : 'gold'}`} aria-hidden="true" />
                  {m}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div variants={item}>
          <Link to={cat.to} className="mega-preview" onClick={onNavigate} aria-label={`Shop ${cat.name}`}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={cat.name}
                src={cat.img}
                alt=""
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              />
            </AnimatePresence>
            <span className="mega-preview-shade" />
            <span className="mega-preview-text">
              <AnimatePresence mode="wait" initial={false}>
                <motion.strong key={cat.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
                  {cat.name}
                </motion.strong>
              </AnimatePresence>
              <small>Shop {countIn(cat.name)} pieces <Icon name="arrowRight" size={14} /></small>
            </span>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to={`/product/${FEATURED.id}`} className="mega-feature" onClick={onNavigate}>
            <span className="mega-feature-img"><img src={FEATURED.img} alt="" /><b>Bestseller</b></span>
            <strong>{FEATURED.name}</strong>
            <small>{FEATURED.material}</small>
            <span className="mega-feature-price">{money(FEATURED.price)}{FEATURED.compareAt && <s>{money(FEATURED.compareAt)}</s>}</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="container mega-foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
        <Link to="/shop" className="link-arrow" onClick={onNavigate}>Shop all {PRODUCTS.length} pieces <Icon name="arrowRight" size={16} /></Link>
        <span>Free shipping over $50 · 30-day easy returns</span>
      </motion.div>
    </motion.div>
  )
}
