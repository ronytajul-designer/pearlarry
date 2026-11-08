import Hero from '../sections/Hero'
import BestSellers from '../sections/BestSellers'
import OurStory from '../sections/OurStory'
import WhyUs from '../sections/WhyUs'
import StylingEdit from '../sections/StylingEdit'
import Categories from '../sections/Categories'
import Testimonials from '../sections/Testimonials'
import Faq from '../sections/Faq'
import Cta from '../sections/Cta'
import { useReady } from '../lib/store'

export default function Home() {
  const ready = useReady()
  return (
    <>
      <Hero ready={ready} />
      <BestSellers />
      <OurStory />
      <WhyUs />
      <StylingEdit />
      <Categories />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  )
}
