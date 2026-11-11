import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BEST_SELLERS, money, money2 } from '../products'
import { EmptyState, Qty } from '../components/ui'
import ProductCard, { ProductRow } from '../components/ProductCard'
import Icon from '../components/Icon'
import { RollText, SplitText, ease } from '../components/motion'
import { useCart, useReady, FREE_SHIPPING_FROM } from '../lib/store'

/** Promo field + totals. Shared by cart and checkout so the maths can never differ. */
export function Totals({ children, compact }) {
  const cart = useCart()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const apply = (e) => {
    e.preventDefault()
    if (!code.trim()) return setErr('Enter a promo code.')
    if (cart.applyPromo(code)) { setErr(''); setCode('') } else setErr('That code isn’t valid. Try WELCOME15.')
  }
  const toFree = FREE_SHIPPING_FROM - (cart.subtotal - cart.discount)
  return (
    <>
      <div className={`sum-rows ${compact ? 'sum-rows--top' : ''}`}>
        <p><span>Subtotal</span><span>{money2(cart.subtotal)}</span></p>
        <AnimatePresence initial={false}>
          {cart.discount > 0 && (
            <motion.p className="sum-discount" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <span>Promo {cart.promo} <button className="sum-remove" onClick={cart.removePromo} aria-label="Remove promo code"><Icon name="x" size={12} /></button></span>
              <span>−{money2(cart.discount)}</span>
            </motion.p>
          )}
        </AnimatePresence>
        <p><span>Shipping{cart.method === 'express' ? ' (Express)' : ''}</span><span>{cart.shipping ? money2(cart.shipping) : 'Free'}</span></p>
        <p><span>Estimated tax (8%)</span><span>{money2(cart.tax)}</span></p>
      </div>
      {!cart.promo && (
        <form className="promo" onSubmit={apply}>
          <label htmlFor="promo" className="sr-only">Promo code</label>
          <input id="promo" className="input" placeholder="Promo code" value={code} onChange={(e) => { setCode(e.target.value); setErr('') }} />
          <button className="btn btn--light btn--sm" type="submit"><RollText text="Apply" /></button>
        </form>
      )}
      {err && <p className="field-error">{err}</p>}
      <p className="sum-total"><span>Total</span><strong>{money2(cart.total)}</strong></p>
      {children}
      {cart.method === 'standard' && toFree > 0 && <p className="sum-hint">Add {money2(toFree)} more for free shipping.</p>}
    </>
  )
}

export default function Cart() {
  const cart = useCart()
  const ready = useReady()

  if (!cart.items.length) {
    return (
      <section className="cart-empty tint">
        <div className="container">
          <EmptyState icon="bag" title="Your bag is empty" text="Your next favourite piece awaits. Explore timeless jewellery to wear, layer and love.">
            <Link to="/shop" className="btn btn--brand"><RollText text="Explore Jewellery" /></Link>
          </EmptyState>
        </div>
      </section>
    )
  }

  const inBag = new Set(cart.items.map((l) => l.id))
  const recs = [...BEST_SELLERS.filter((p) => !inBag.has(p.id)), ...BEST_SELLERS.filter((p) => inBag.has(p.id))].slice(0, 4)

  return (
    <>
      <section className="cart tint">
        <div className="container">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={ready ? { opacity: 1, x: 0 } : undefined} transition={{ duration: 0.6, ease }}>
            <Link to="/shop" className="back-link"><Icon name="arrowLeft" size={16} /> Continue shopping</Link>
          </motion.div>
          <div className="cart-title">
            <SplitText as="h1" className="page-title page-title--left" text="Shopping Bag" play={ready} />
            <motion.span className="cart-count" key={cart.count} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {cart.count} {cart.count === 1 ? 'item' : 'items'}
            </motion.span>
          </div>

          <div className="cart-grid">
            <ul className="cart-lines">
              <AnimatePresence initial={false}>
                {cart.items.map((l, i) => (
                  <motion.li
                    key={`${l.id}|${l.option}`}
                    className="cart-line"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.06 } }}
                    exit={{ opacity: 0, x: -40, height: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 0.4, ease } }}
                  >
                    <Link to={`/product/${l.id}`} className="cart-thumb"><img src={l.product.img} alt="" /></Link>
                    <div className="cart-info">
                      <Link to={`/product/${l.id}`} className="cart-name">{l.product.name}</Link>
                      <p className="cart-meta">
                        {l.product.metal}
                        {l.option && ` · ${l.product.option.label === 'Ring size' ? `Size ${l.option}` : l.option}`}
                      </p>
                      <button className="cart-remove" onClick={() => cart.remove(l.id, l.option)}><Icon name="trash" size={14} /> Remove</button>
                    </div>
                    <Qty value={l.qty} onChange={(q) => cart.setQty(l.id, l.option, q)} small />
                    <p className="cart-price">{money(l.qty * l.product.price)}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <motion.aside className="summary" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 0.2 }}>
              <h2 className="h5">Order Summary</h2>
              <Totals>
                <Link to="/checkout" className="btn btn--brand btn--block"><RollText text="Proceed to Checkout" /></Link>
                <ul className="sum-trust">
                  <li><Icon name="shield" size={14} /> Secure checkout — SSL encrypted</li>
                  <li><Icon name="truck" size={14} /> Free shipping on orders over $50</li>
                </ul>
              </Totals>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="section related tint related--cart">
        <div className="container">
          <SplitText as="h2" className="h3" text="You might also like" />
          <ProductRow>
            {recs.map((p, i) => <ProductCard key={p.id} p={p} i={i} variant="product--white" group />)}
          </ProductRow>
        </div>
      </section>
    </>
  )
}
