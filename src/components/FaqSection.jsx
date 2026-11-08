import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, SplitText, ease, RollText } from './motion'

/**
 * The one FAQ block used on Home and Product Detail: same layout, same accordion, same motion.
 * Items may carry an `id`; a link to `#faq-<id>` scrolls here and opens that question.
 */
export default function FaqSection({ items, id = 'faq' }) {
  const { hash } = useLocation()
  const fromHash = () => Math.max(0, items.findIndex((f) => f.id && hash === `#faq-${f.id}`))
  const [open, setOpen] = useState(fromHash)
  useEffect(() => { if (hash.startsWith('#faq-')) setOpen(fromHash()) }, [hash]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="section faq tint" id={id}>
      {items.filter((f) => f.id).map((f) => <span key={f.id} id={`faq-${f.id}`} className="faq-anchor" aria-hidden="true" />)}
      <div className="container faq-inner">
        <div className="faq-head">
          <Reveal as="p" className="eyebrow" y={10}>FAQ</Reveal>
          <SplitText as="h2" className="h3 faq-title" text={['Frequently asked', 'questions']} />
          <Reveal as="p" className="lede" delay={0.15} y={14}>
            Can’t find the answer you’re looking for? Our care team is always happy to help.
          </Reveal>
          <Reveal delay={0.25} y={14}>
              <Link to="/contact" className="btn btn--brand"><RollText text="Contact Support" /></Link>
          </Reveal>
        </div>

        <div className="faq-list">
          {items.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={f.q}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease, delay: i * 0.07 }}
                layout
              >
                <h3>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a-${i}`}
                    id={`${id}-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <span />
                      <motion.span initial={false} animate={{ rotate: isOpen ? 0 : 90, opacity: isOpen ? 0 : 1 }} transition={{ duration: 0.4, ease }} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a-${i}`}
                      role="region"
                      aria-labelledby={`${id}-q-${i}`}
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
