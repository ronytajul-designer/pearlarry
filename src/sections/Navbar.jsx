import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Icon from '../components/Icon'
import { ease } from '../components/motion'
import { NAV } from '../data'
import { useScrollTo } from '../lib/smooth'

export default function Navbar({ cart, ready }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 400 && y > prev && !open)
  })

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href === '#top' ? 0 : href)
  }

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden ? -100 : 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <a href="#top" className="logo" onClick={(e) => go(e, '#top')}>Pearlarry</a>

        <nav className="nav-links" aria-label="Primary">
          {NAV.map((l) => (
            <a key={l.label} href={l.href} onClick={(e) => go(e, l.href)} className="nav-link">
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn search-btn" aria-label="Search"><Icon name="search" /></button>
          <button className="icon-btn" aria-label={`Cart, ${cart} items`}>
            <Icon name="cart" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={cart}
                className="badge"
                initial={{ scale: 0.2, y: 6 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                {cart}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="icon-btn is-filled hide-sm" aria-label="Account"><Icon name="user" /></button>
          <button
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Search is a real field here (higher discoverability than an icon); cart stays in the header. */}
            <motion.form
              className="mm-search"
              role="search"
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6, ease } }}
              exit={{ opacity: 0 }}
            >
              <Icon name="search" size={20} />
              <label htmlFor="mm-q" className="sr-only">Search jewellery</label>
              <input id="mm-q" type="search" placeholder="Search rings, hoops, pendants" />
            </motion.form>

            <nav aria-label="Mobile" className="mm-nav">
              {NAV.map((l, i) => (
                <div className="split-mask" key={l.label}>
                  <motion.a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.7, ease, delay: 0.25 + i * 0.06 }}
                  >
                    {l.label}
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              className="mm-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href="#top" className="mm-account" onClick={(e) => e.preventDefault()}>
                <Icon name="user" size={20} /> My account
              </a>
              <p>Thoughtful details. Timeless designs.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
