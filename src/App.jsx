import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { SmoothScroll, ScrollTrigger, prefersReducedMotion } from './lib/smooth'
import Preloader from './sections/Preloader'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import BestSellers from './sections/BestSellers'
import OurStory from './sections/OurStory'
import WhyUs from './sections/WhyUs'
import StylingEdit from './sections/StylingEdit'
import Categories from './sections/Categories'
import Testimonials from './sections/Testimonials'
import Faq from './sections/Faq'
import Cta from './sections/Cta'
import Footer from './sections/Footer'

export default function App() {
  const [loading, setLoading] = useState(() => !prefersReducedMotion())
  const [cart, setCart] = useState(3)

  // Fonts and images change layout heights; refresh trigger positions once settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll paused={loading}>
        {loading && <Preloader onDone={() => setLoading(false)} />}
        <a className="skip" href="#main">Skip to content</a>
        <Navbar cart={cart} ready={!loading} />
        <main id="main">
          <Hero ready={!loading} />
          <BestSellers onAdd={() => setCart((c) => c + 1)} />
          <OurStory />
          <WhyUs />
          <StylingEdit />
          <Categories />
          <Testimonials />
          <Faq />
          <Cta />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  )
}
