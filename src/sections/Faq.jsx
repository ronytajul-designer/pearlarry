import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAQS } from '../data'
import { Magnetic, Reveal, SplitText, ease, RollText } from '../components/motion'

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq tint" id="faq">
      <div className="container faq-inner">
        <div className="faq-head">
          <Reveal as="p" className="eyebrow" y={10}>FAQ</Reveal>
          <SplitText as="h2" className="h3 faq-title" text={['Frequently asked', 'questions']} />
          <Reveal as="p" className="lede" delay={0.15} y={14}>
            Can’t find the answer you’re looking for? Our care team is always happy to help.
          </Reveal>
          <Reveal delay={0.25} y={14}>
            <Magnetic>
              <a href="mailto:hello@pearlarry.com" className="btn btn--brand"><RollText text="Contact Support" /></a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="faq-list">
          {FAQS.map((f, i) => {
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
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
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
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
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
