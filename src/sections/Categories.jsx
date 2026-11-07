import { motion } from 'framer-motion'
import { CATEGORIES } from '../data'
import { Reveal, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'

export default function Categories() {
  return (
    <section className="section cats tint" id="categories">
      <div className="container">
        <div className="cats-head">
          <Reveal as="p" className="eyebrow" y={10}>Shop by Category</Reveal>
          <SplitText as="h2" className="h3" text="Find your style" />
        </div>
        <div className="cats-grid">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              className={`cat cat--${c.area}`}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* In-view is observed on the unclipped wrapper: a fully clipped element never intersects. */}
              <motion.a
                href="#categories"
                className="cat-inner"
                aria-label={`Shop ${c.name}, ${c.count} pieces`}
                variants={{
                  hidden: { clipPath: 'inset(100% 0% 0% 0% round 16px)' },
                  show: { clipPath: 'inset(0% 0% 0% 0% round 16px)', transition: { duration: 1.3, ease, delay: i * 0.1 } },
                }}
              >
                <motion.img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  variants={{
                    hidden: { scale: 1.3 },
                    show: { scale: 1, transition: { duration: 1.6, ease, delay: i * 0.1 } },
                    hover: { scale: 1.06, transition: { duration: 1.2, ease } },
                  }}
                />
                <span className="cat-label">
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.count} pieces</small>
                  </span>
                  <motion.span className="cat-arrow" variants={{ hidden: { width: 0, opacity: 0, marginLeft: 0 }, show: { width: 0, opacity: 0, marginLeft: 0 }, hover: { width: 28, opacity: 1, marginLeft: 8 } }} transition={{ duration: 0.35, ease }}>
                    <Icon name="arrowRight" size={18} />
                  </motion.span>
                </span>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
