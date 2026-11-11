import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType, useOutlet } from 'react-router-dom'
import { SmoothScroll, ScrollTrigger, prefersReducedMotion, useLenis } from './lib/smooth'
import { ReadyCtx, StoreProvider } from './lib/store'
import { ease } from './components/motion'
import Preloader from './sections/Preloader'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { AccountLayout, Overview, Orders, Addresses, Payments, Wishlist, Settings } from './pages/Account'
import { Login, Register, Forgot, Reset } from './pages/Auth'
import NotFound from './pages/NotFound'

const SWAP = 'pl:page-swap'

function jumpTo(lenis, target) {
  if (lenis) lenis.scrollTo(target, { immediate: true, force: true, offset: typeof target === 'number' ? 0 : -88 })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 88)
}

/**
 * Scroll rules for every navigation (links, footer, browser back/forward):
 *  - new page: jump to the top the moment the old page has faded out, so it always starts at the top
 *  - same page, new URL (e.g. footer "Rings" while on /shop): smooth-scroll to the top
 *  - #hash: land on that section once the new page has laid out
 *  - replace navigations (shop filters, sort, pagination) keep the current position
 */
function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()
  const lenis = useLenis()
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    const { pathname, hash } = location
    const changedPage = prevPath.current !== pathname
    prevPath.current = pathname
    if (navType === 'REPLACE') return

    const timers = []
    const goHash = () => {
      // Two passes: once laid out, again after lazy images/fonts settle.
      ;[80, 700].forEach((ms) => timers.push(setTimeout(() => {
        ScrollTrigger.refresh()
        const el = hash && document.querySelector(hash)
        if (el) jumpTo(lenis, el)
      }, ms)))
    }
    let done = false
    const onSwap = () => {
      if (done) return
      done = true
      jumpTo(lenis, 0)
      if (hash) goHash()
      else timers.push(setTimeout(() => ScrollTrigger.refresh(), 300))
    }

    if (changedPage) {
      window.addEventListener(SWAP, onSwap, { once: true })
      // Switching between layouts (e.g. /login to /) remounts without an exit: don't wait forever.
      const fallback = setTimeout(onSwap, 900)
      return () => { window.removeEventListener(SWAP, onSwap); clearTimeout(fallback); timers.forEach(clearTimeout) }
    }
    if (hash) {
      const el = document.querySelector(hash)
      if (el) lenis ? lenis.scrollTo(el, { offset: -88, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
    } else if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return () => timers.forEach(clearTimeout)
  }, [location.key]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

const announceSwap = () => window.dispatchEvent(new Event(SWAP))

/** Same enter/exit on every page: content lifts in, old page fades out. */
function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  )
}

// useOutlet (not <Outlet/>) so the exiting page keeps rendering its own content during the fade.
function SiteLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={announceSwap}>
        <PageFade key={location.pathname}>
          <main id="main">{outlet}</main>
          <Footer />
        </PageFade>
      </AnimatePresence>
    </>
  )
}

function BareLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  return (
    <AnimatePresence mode="wait" onExitComplete={announceSwap}>
      <PageFade key={location.pathname}>
        <main id="main">{outlet}</main>
      </PageFade>
    </AnimatePresence>
  )
}

export default function App() {
  const [loading, setLoading] = useState(() => !prefersReducedMotion())

  // Fonts and images change layout heights; refresh trigger positions once settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <MotionConfig reducedMotion="user">
        <StoreProvider>
          <ReadyCtx.Provider value={!loading}>
            <SmoothScroll paused={loading}>
              {loading && <Preloader onDone={() => setLoading(false)} />}
              <ScrollManager />
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="account" element={<AccountLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="addresses" element={<Addresses />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route element={<BareLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<Forgot />} />
                  <Route path="reset-password" element={<Reset />} />
                </Route>
              </Routes>
            </SmoothScroll>
          </ReadyCtx.Provider>
        </StoreProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
