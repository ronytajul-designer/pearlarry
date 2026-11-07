import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IMG } from '../data'
import { ParallaxImg, SplitText, ease, RollText } from '../components/motion'
import Icon from '../components/Icon'

export default function Cta() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | error | done

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState('error')
    // Front-end only: wire this to your ESP (Klaviyo, Mailchimp, Shopify) before launch.
    setState('done')
  }

  return (
    <section className="section cta" id="offer">
      <div className="container">
        <motion.div
          className="cta-panel"
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="cta-content">
            <motion.span
              className="cta-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.4 }}
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 6, ease: 'linear', repeat: Infinity }} aria-hidden="true">✦</motion.span>
              Limited-time welcome offer
            </motion.span>
            <SplitText as="h2" className="h2 cta-title" text={['Get 15% off your first', 'Pearlarry piece']} delay={0.2} />
            <p className="cta-text">Sign up for new collections, styling ideas, and a welcome offer for your first Pearlarry piece.</p>

            <AnimatePresence mode="wait">
              {state !== 'done' ? (
                <motion.form
                  key="form"
                  className={`newsletter ${state === 'error' ? 'is-error' : ''}`}
                  onSubmit={submit}
                  noValidate
                  exit={{ opacity: 0, y: -10 }}
                  animate={state === 'error' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
                    aria-invalid={state === 'error'}
                    aria-describedby="email-note"
                  />
                  <button type="submit" className="btn btn--brand"><RollText text="Claim 15% off" /></button>
                </motion.form>
              ) : (
                <motion.div key="ok" className="newsletter-ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
                  <span className="ok-icon"><Icon name="check" size={18} stroke={2.4} /></span>
                  You’re in. Check your inbox for your 15% code.
                </motion.div>
              )}
            </AnimatePresence>
            <p className="cta-note" id="email-note" aria-live="polite">
              {state === 'error' ? 'Please enter a valid email address.' : 'No spam, just style notes. Unsubscribe anytime.'}
            </p>
          </div>
          <ParallaxImg className="cta-img" src={IMG.hero} alt="Gold hoops and fine chain on ivory silk" speed={18} reveal={false} />
        </motion.div>
      </div>
    </section>
  )
}
