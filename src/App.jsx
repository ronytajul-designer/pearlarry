import { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation, useOutlet } from 'react-router-dom'
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

/** Reset scroll on every route change, honour #hash targets, refresh ScrollTrigger once laid out. */
function ScrollManager() {
  const { pathname, hash, search } = useLocation()
  const lenis = useLenis()
  useLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])
  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      if (hash) {
        const el = document.querySelector(hash)
        if (el) lenis ? lenis.scrollTo(el, { offset: -80, duration: 1.4 }) : el.scrollIntoView()
      }
    }, 650)
    return () => clearTimeout(t)
  }, [pathname, hash, search, lenis])
  return null
}

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
      <AnimatePresence mode="wait" initial={false}>
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
    <AnimatePresence mode="wait" initial={false}>
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
