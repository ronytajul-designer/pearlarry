import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IMG } from '../images'
import Icon from '../components/Icon'
import { ease } from '../components/motion'

const q = (k, v) => `/shop?${k}=${encodeURIComponent(v)}`

export const MEGA_CATEGORIES = [
  { name: 'Rings', img: IMG.ring, blurb: 'Stackable bands and signet styles', to: q('category', 'Rings') },
  { name: 'Necklaces', img: IMG.pendant, blurb: 'Pendants made to layer', to: q('category', 'Necklaces') },
  { name: 'Earrings', img: IMG.hoops, blurb: 'Hoops and huggies for every day', to: q('category', 'Earrings') },
  { name: 'Bracelets', img: IMG.bracelet, blurb: 'Fine chains, adjustable fit', to: q('category', 'Bracelets') },
]

const LINKS = [
  ['Edits', [['Everyday Edit', q('category', 'Everyday Edit')], ['Gifts', q('category', 'Gifts')], ['Under $25', q('price', 'Under $25')]]],
  ['Materials', [['14k Gold Vermeil', q('material', '14k Gold Vermeil')], ['18k Gold Plated', q('material', '18k Gold Plated')], ['Sterling Silver', q('material', 'Sterling Silver')]]],
]

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
      {/* Three calm columns: categories, a short list of edits, one preview image. */}
      <motion.div className="mega-grid" variants={list} initial="hidden" animate="show">
        <div>
          <motion.p className="mega-h" variants={item}>Categories</motion.p>
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
                  <span>{c.name}</span>
                  <Icon name="arrowRight" size={16} className="mega-cat-arrow" />
                </Link>
              </motion.li>
            ))}
          </ul>
          <motion.div variants={item}>
            <Link to="/shop" className="link-arrow mega-all" onClick={onNavigate}>Shop all jewellery <Icon name="arrowRight" size={16} /></Link>
          </motion.div>
        </div>

        <div className="mega-lists">
          {LINKS.map(([title, links]) => (
            <div key={title}>
              <motion.p className="mega-h" variants={item}>{title}</motion.p>
              <ul className="mega-links">
                {links.map(([label, to]) => (
                  <motion.li key={label} variants={item}><Link to={to} onClick={onNavigate}>{label}</Link></motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div variants={item}>
          <Link to={cat.to} className="mega-preview" onClick={onNavigate} aria-label={`Shop ${cat.name}`}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={cat.name}
                src={cat.img}
                alt=""
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              />
            </AnimatePresence>
            <span className="mega-preview-shade" />
            <span className="mega-preview-text">
              <AnimatePresence mode="wait" initial={false}>
                <motion.strong key={cat.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
                  {cat.blurb}
                </motion.strong>
              </AnimatePresence>
              <small>Shop {cat.name.toLowerCase()} <Icon name="arrowRight" size={14} /></small>
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
