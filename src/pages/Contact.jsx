import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Field, PageHeader } from '../components/ui'
import { Reveal, RollText, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'

const INFO = [
  ['mail', 'Email', 'hello@pearlarry.com', 'mailto:hello@pearlarry.com'],
  ['phone', 'Phone', '+1 (555) 012-3456', 'tel:+15550123456'],
  ['mapPin', 'Jewellery studio', '123 Botanic Ave, Brooklyn, NY'],
  ['clock', 'Hours', 'Mon–Fri, 9am – 6pm EST'],
]

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [f, setF] = useState(EMPTY)
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: undefined }) }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = 'Please enter a valid email address.'
    if (f.message.trim().length < 10) er.message = 'Tell us a little more so we can help (10 characters or more).'
    setErr(er)
    if (!Object.keys(er).length) setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Jewellery care & orders"
        title="Jewellery care, sizing & order support"
        lede="Questions about sizing, materials, or your order? Our jewellery care team is here to help with ring sizing, metal choices, care tips, and order updates."
      />
      <section className="section contact">
        <div className="container contact-grid">
          <div>
            <SplitText as="h2" className="h4" text="Send us a jewellery enquiry" />
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" className="success-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                  <span className="success-icon"><Icon name="check" size={26} stroke={2.2} /></span>
                  <h3 className="h5">Thank you, {f.name.split(' ')[0]}.</h3>
                  <p>Your enquiry is with our care team. We reply within one business day at {f.email}.</p>
                  <button className="btn btn--light" onClick={() => { setF(EMPTY); setSent(false) }}><RollText text="Send another enquiry" /></button>
                </motion.div>
              ) : (
                <motion.form key="form" className="form-grid" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
                  <Reveal y={16}><Field label="Full name" placeholder="Jane Doe" autoComplete="name" value={f.name} onChange={set('name')} error={err.name} /></Reveal>
                  <Reveal y={16} delay={0.05}><Field label="Email address" type="email" placeholder="jane@email.com" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} /></Reveal>
                  <Reveal y={16} delay={0.1} className="span-2"><Field label="Subject" placeholder="Sizing, materials, care, or order help?" value={f.subject} onChange={set('subject')} /></Reveal>
                  <Reveal y={16} delay={0.15} className="span-2"><Field label="Message" as="textarea" rows={5} placeholder="Tell us about your piece, sizing, material, or order…" value={f.message} onChange={set('message')} error={err.message} /></Reveal>
                  <Reveal y={16} delay={0.2}><button className="btn btn--brand" type="submit"><RollText text="Send jewellery enquiry" /></button></Reveal>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <motion.aside className="info-card" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease }}>
            <h2 className="h5">Contact information</h2>
            <ul>
              {INFO.map(([icon, label, value, href], i) => (
                <motion.li key={label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.08 }}>
                  <Icon name={icon} size={18} />
                  <span>
                    <small>{label}</small>
                    {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </section>
    </>
  )
}
