import { Link } from 'react-router-dom'
import { BEST_SELLERS } from '../data'
import { Reveal, SplitText } from '../components/motion'
import ProductCard, { ProductRow } from '../components/ProductCard'

export default function BestSellers() {
  return (
    <section className="section best" id="best-sellers">
      <div className="container">
        <div className="best-head">
          <div>
            <Reveal as="p" className="eyebrow" y={12}>Best-selling pieces</Reveal>
            <SplitText as="h2" className="h3" text="Worn by Our Community" />
            <Reveal as="p" className="lede" delay={0.2} y={16}>
              Our most-loved pieces, chosen for everyday wear and special occasions.
            </Reveal>
          </div>
          <Reveal delay={0.3} y={12}>
            <Link to="/shop" className="link-underline">View All Jewellery</Link>
          </Reveal>
        </div>
        <ProductRow>
          {BEST_SELLERS.map((p, i) => <ProductCard key={p.id} p={p} i={i} group />)}
        </ProductRow>
      </div>
    </section>
  )
}
