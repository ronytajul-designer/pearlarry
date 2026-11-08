import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { Reveal, SplitText, ease } from './motion'
import { useReady } from '../lib/store'

/* ---------- Page header: same choreography on every inner page ---------- */
export function PageHeader({ eyebrow, title, lede, className = '' }) {
  const ready = useReady()
  return (
    <section className={`page-head tint ${className}`}>
      <div className="container center-head">
        {eyebrow && (
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease, delay: 0.1 }}>
            {eyebrow}
          </motion.p>
        )}
        <SplitText as="h1" className="page-title" text={title} play={ready} delay={0.15} stagger={0.05} />
        {lede && (
          <motion.p className="lede page-lede" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 0.45 }}>
            {lede}
          </motion.p>
        )}
      </div>
    </section>
  )
}

/* ---------- Form controls ---------- */
export function Field({ label, error, hint, as = 'input', className = '', right, ...rest }) {
  const id = useId()
  const Tag = as
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={id} className="field-label">{label}</label>}
      <div className="field-box">
        <Tag id={id} className="input" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...rest} />
        {right}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p id={`${id}-e`} className="field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && <p className="field-hint">{hint}</p>}
    </div>
  )
}

export function PasswordField(props) {
  const [show, setShow] = useState(false)
  return (
    <Field
      {...props}
      type={show ? 'text' : 'password'}
      right={
        <button type="button" className="field-icon" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
        </button>
      }
    />
  )
}

export function SelectField({ label, options, className = '', ...rest }) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id} className="field-label">{label}</label>}
      <div className="field-box select-box">
        <select id={id} className="input" {...rest}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Icon name="chevronDown" size={18} className="select-caret" />
      </div>
    </div>
  )
}

export function Checkbox({ checked, onChange, label, count, className = '' }) {
  return (
    <label className={`check ${className}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check-box" aria-hidden="true">
        <motion.svg viewBox="0 0 24 24" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}>
          <motion.path d="M5 12l5 5l10 -10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: 0.3 }} />
        </motion.svg>
      </span>
      <span className="check-label">{label}</span>
      {count !== undefined && <span className="check-count">{count}</span>}
    </label>
  )
}

export function Radio({ checked, onChange, name, children, className = '' }) {
  return (
    <label className={`radio ${checked ? 'is-on' : ''} ${className}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="radio-dot" aria-hidden="true"><motion.span initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ duration: 0.3, ease }} /></span>
      {children}
    </label>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
      <motion.span className="toggle-knob" layout transition={{ type: 'spring', stiffness: 600, damping: 36 }} />
    </button>
  )
}

export function Qty({ value, onChange, min = 1, max = 9, small }) {
  return (
    <div className={`qty ${small ? 'qty--sm' : ''}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity"><Icon name="minus" size={16} /></button>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }} aria-live="polite">{value}</motion.span>
      </AnimatePresence>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity"><Icon name="plus" size={16} /></button>
    </div>
  )
}

export function Stars({ value = 5, size = 16 }) {
  return (
    <span className="stars-gold" aria-label={`${value} out of 5 stars`} role="img">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" fill={i < Math.round(value) ? '#ffc83d' : '#efe8e4'} />
        </svg>
      ))}
    </span>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="crumb">
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <Icon name="chevronRight" size={14} />}
        </span>
      ))}
    </nav>
  )
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()} data-lenis-prevent>
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="modal-head">
              <h2 className="h5">{title}</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={20} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Accordion (shared by home FAQ style and product FAQ) ---------- */
export function Accordion({ items, defaultOpen = 0, variant = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  const base = useId()
  return (
    <div className={`acc ${variant}`}>
      {items.map((f, i) => {
        const on = open === i
        return (
          <div key={f.q} className={`acc-item ${on ? 'is-open' : ''}`}>
            <h3>
              <button className="acc-q" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{f.q}</span>
                <motion.span animate={{ rotate: on ? 180 : 0 }} transition={{ duration: 0.4, ease }} className="acc-icon"><Icon name="chevronDown" size={20} /></motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`${base}-${i}`} className="acc-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon = 'bag', title, text, children }) {
  return (
    <div className="empty">
      <motion.span className="empty-icon" initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 16 }}>
        <Icon name={icon} size={30} stroke={1.5} />
      </motion.span>
      <SplitText as="h2" className="h3" text={title} play />
      <Reveal as="p" className="lede" delay={0.2} y={12}>{text}</Reveal>
      <Reveal className="empty-actions" delay={0.3} y={12}>{children}</Reveal>
    </div>
  )
}

/* ---------- Brand marks for express pay / social sign-in ---------- */
export const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
)
export const AppleMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.59-.75 2.99-.75 1.4 0 1.79.75 3.01.72 1.24-.02 2.03-1.13 2.79-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.45-3.69zM14.07 5.85c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.1 1.77-.96 2.82 1.02.08 2.06-.52 2.7-1.28z" />
  </svg>
)
export const PayPalMark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#003087" d="M7.08 21.5H3.6a.5.5 0 0 1-.5-.58L5.9 3.1A.7.7 0 0 1 6.6 2.5h6.1c3.2 0 5.3 1.6 4.8 4.8-.6 3.8-3.1 5.4-6.4 5.4H9.4a.7.7 0 0 0-.7.6z" />
    <path fill="#0070E0" d="M18.6 7.6c-.6 3.6-3.1 5.4-6.6 5.4h-1.4a.7.7 0 0 0-.7.6l-1 6.6-.3 1.8a.4.4 0 0 0 .4.5h3a.6.6 0 0 0 .6-.5l.6-3.9a.6.6 0 0 1 .6-.5h.8c3 0 5.2-1.4 5.8-4.7.3-1.9-.3-3.3-1.8-4.3z" />
  </svg>
)
