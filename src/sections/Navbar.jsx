import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { ease } from '../components/motion'
import { NAV, PRODUCTS } from '../data'
import { useCart, useReady } from '../lib/store'
import { money } from '../products'
import MegaMenu, { MEGA_CATEGORIES } from './MegaMenu'

const MotionLink = motion.create(Link)

/** Live product search: results as you type, Enter goes to the full shop results. */
function SearchPanel({ onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const input = useRef(null)
  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return PRODUCTS.slice(0, 4)
    return PRODUCTS.filter((p) => `${p.name} ${p.category} ${p.metal}`.toLowerCase().includes(t)).slice(0, 5)
  }, [q])
  const submit = (e) => {
    e.preventDefault()
    onClose()
    navigate(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }
  return (
    <>
      <motion.div className="search-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="search-panel"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease }}
        role="dialog"
        aria-label="Search"
      >
        <form className="search-form" role="search" onSubmit={submit}>
          <Icon name="search" size={22} />
          <label htmlFor="site-q" className="sr-only">Search jewellery</label>
          <input id="site-q" ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rings, hoops, pendants" autoComplete="off" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><Icon name="x" size={20} /></button>
        </form>
        <p className="search-label">{q.trim() ? `${results.length ? 'Pieces' : 'No pieces'} matching “${q.trim()}”` : 'Popular right now'}</p>
        <ul className="search-results">
          {results.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.04 }}>
              <Link to={`/product/${p.id}`} onClick={onClose} className="search-item">
                <img src={p.img} alt="" />
                <span><strong>{p.name}</strong><small>{p.material}</small></span>
                <em>{money(p.price)}</em>
              </Link>
            </motion.li>
          ))}
        </ul>
        {q.trim() && <button className="link-underline search-all" onClick={submit}>See all results</button>}
      </motion.div>
    </>
  )
}

export default function Navbar() {
  const ready = useReady()
  const { count: cart } = useCart()
  const { pathname, search: searchParams } = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const [mega, setMega] = useState(false)
  const megaTimer = useRef(null)
  // Hover intent: small open delay avoids flicker when the pointer just passes over the nav.
  const megaOpen = (delay = 90) => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(true), delay) }
  const megaClose = (delay = 180) => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(false), delay) }
  useEffect(() => {
    if (!mega) return
    const k = (e) => { if (e.key === 'Escape') { setMega(false); document.querySelector('.nav-caret')?.focus() } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [mega])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 400 && y > prev && !open && !search && !mega)
  })

  // Close overlays whenever the route changes.
  useEffect(() => { setOpen(false); setSearch(false); setMega(false) }, [pathname, searchParams])

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''} ${mega ? 'is-mega' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden ? -100 : 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <Link to="/" className="logo">Pearlarry</Link>

        <nav className="nav-links" aria-label="Primary">
          {NAV.map((l) => l.to === '/shop' ? (
            <div key={l.label} className={`nav-item ${mega ? 'is-open' : ''}`} onPointerEnter={() => megaOpen()} onPointerLeave={() => megaClose()}>
              <NavLink to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`} onClick={() => setMega(false)}>
                <span data-text={l.label}>{l.label}</span>
              </NavLink>
              <button className="nav-caret" aria-label="Browse jewellery" aria-expanded={mega} aria-controls="mega-menu" onClick={() => setMega((m) => !m)}>
                <Icon name="chevronDown" size={14} stroke={2} />
              </button>
            </div>
          ) : (
            <NavLink key={l.label} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              <span data-text={l.label}>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn search-btn" aria-label="Search" aria-expanded={search} onClick={() => { setOpen(false); setMega(false); setSearch(true) }}><Icon name="search" /></button>
          <Link to="/cart" className="icon-btn" aria-label={`Bag, ${cart} items`}>
            <Icon name="cart" />
            <AnimatePresence mode="popLayout" initial={false}>
              {cart > 0 && <motion.span
                key={cart}
                className="badge"
                initial={{ scale: 0.2, y: 6 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                {cart}
              </motion.span>}
            </AnimatePresence>
          </Link>
          <Link to="/account" className="icon-btn is-filled hide-sm" aria-label="Account"><Icon name="user" /></Link>
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
        {mega && (
          <>
            <motion.div key="mega-scrim" className="mega-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} onClick={() => setMega(false)} />
            <MegaMenu key="mega" onNavigate={() => setMega(false)} onEnter={() => megaOpen(0)} onLeave={() => megaClose()} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>{search && <SearchPanel onClose={() => setSearch(false)} />}</AnimatePresence>

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
              onSubmit={(e) => {
                e.preventDefault()
                const q = new FormData(e.currentTarget).get('q')?.toString().trim()
                navigate(`/shop${q ? `?q=${encodeURIComponent(q)}` : ''}`)
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6, ease } }}
              exit={{ opacity: 0 }}
            >
              <Icon name="search" size={20} />
              <label htmlFor="mm-q" className="sr-only">Search jewellery</label>
              <input id="mm-q" name="q" type="search" placeholder="Search rings, hoops, pendants" />
            </motion.form>

            <nav aria-label="Mobile" className="mm-nav">
              {NAV.map((l, i) => (
                <div className="split-mask" key={l.label}>
                  <MotionLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={pathname === l.to ? 'is-active' : ''}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.7, ease, delay: 0.25 + i * 0.06 }}
                  >
                    {l.label}
                  </MotionLink>
                </div>
              ))}
            </nav>

            <motion.div
              className="mm-cats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6, ease } }}
              exit={{ opacity: 0 }}
            >
              <p>Shop by category</p>
              <div>
                {MEGA_CATEGORIES.map((c) => (
                  <Link key={c.name} to={c.to} onClick={() => setOpen(false)} className="mm-cat">
                    <img src={c.img} alt="" />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mm-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <Link to="/account" className="mm-account" onClick={() => setOpen(false)}>
                <Icon name="user" size={20} /> My account
              </Link>
              <p>Thoughtful details. Timeless designs.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
