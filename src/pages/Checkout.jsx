import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getProduct, money, money2 } from '../products'
import { AppleMark, Checkbox, EmptyState, Field, GoogleMark, PayPalMark, Radio, SelectField } from '../components/ui'
import Icon from '../components/Icon'
import { Reveal, RollText, SplitText, ease } from '../components/motion'
import { useAuth, useCart, useReady, useToast } from '../lib/store'
import { Totals } from './Cart'

const COUNTRIES = ['Portugal', 'United States', 'United Kingdom', 'Spain', 'France', 'Germany', 'Indonesia', 'Bangladesh']
const BUNDLE = ['signature-hoops', 'radiance-pendant', 'everyday-ring']

const empty = { email: '', phone: '', first: '', last: '', address: '', city: '', postal: '', country: 'Portugal', card: '', exp: '', cvc: '', nameOnCard: '' }

const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const fmtExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d }

function Bundle() {
  const cart = useCart()
  const toast = useToast()
  const items = BUNDLE.map(getProduct)
  const [on, setOn] = useState(BUNDLE)
  const picked = items.filter((p) => on.includes(p.id))
  const full = picked.reduce((n, p) => n + p.price, 0)
  const all = picked.length === items.length
  const price = all ? full * 0.9 : full
  const add = () => {
    picked.forEach((p) => cart.add(p.id, p.option?.default ?? null))
    toast(`${picked.length} ${picked.length === 1 ? 'piece' : 'pieces'} added to your bag`)
  }
  return (
    <section className="section bundle tint">
      <div className="container">
        <SplitText as="h2" className="h3" text="Frequently bought together" />
        <Reveal as="p" className="lede" y={12}>Style them together and save 10% on the complete set.</Reveal>
        <div className="bundle-row">
          <div className="bundle-items">
            {items.map((p, i) => (
              <Reveal className="bundle-item-wrap" key={p.id} delay={i * 0.08} y={24}>
                <div className={`bundle-item ${on.includes(p.id) ? '' : 'is-off'}`}>
                  <div className="bundle-img">
                    <img src={p.img} alt="" loading="lazy" />
                    <Checkbox className="bundle-check" label={<span className="sr-only">Include {p.name}</span>} checked={on.includes(p.id)} onChange={(v) => setOn((o) => (v ? [...o, p.id] : o.filter((x) => x !== p.id)))} />
                  </div>
                  <Link to={`/product/${p.id}`} className="bundle-name">{p.name}</Link>
                  <p className="bundle-price">{money(p.price)}</p>
                </div>
                {i < items.length - 1 && <span className="bundle-plus" aria-hidden="true"><Icon name="plus" size={20} /></span>}
              </Reveal>
            ))}
          </div>
          <Reveal className="bundle-buy" delay={0.2} y={24}>
            <p className="bundle-label">{all ? 'Buy the set' : 'Your selection'}</p>
            <p className="bundle-total">
              <strong>{money2(price)}</strong>
              {all && <s>{money2(full)}</s>}
              {all && <span className="bundle-save"><Icon name="tag" size={14} /> You save {money2(full - price)} with this bundle</span>}
            </p>
            <button className="btn btn--brand btn--block" onClick={add} disabled={!picked.length}>
              <RollText text={picked.length ? `Add ${all ? 'all ' : ''}${picked.length} to cart` : 'Select a piece'} />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Checkout() {
  const cart = useCart()
  const auth = useAuth()
  const ready = useReady()
  const [f, setF] = useState(empty)
  const [err, setErr] = useState({})
  const [pay, setPay] = useState('card')
  const [placed, setPlaced] = useState(null)
  const set = (k, fmt) => (e) => { setF({ ...f, [k]: fmt ? fmt(e.target.value) : e.target.value }); if (err[k]) setErr({ ...err, [k]: undefined }) }

  if (placed) {
    return (
      <section className="cart-empty tint">
        <div className="container">
          <EmptyState icon="check" title="Thank you for your order" text={`Order #${placed.no} is confirmed. We’ve sent the receipt to ${placed.email}. Total paid ${money2(placed.total)}.`}>
            <Link to="/account/orders" className="btn btn--brand"><RollText text="View my orders" /></Link>
            <Link to="/shop" className="btn btn--light"><RollText text="Continue shopping" /></Link>
          </EmptyState>
        </div>
      </section>
    )
  }

  if (!cart.items.length) {
    return (
      <section className="cart-empty tint">
        <div className="container">
          <EmptyState icon="bag" title="Your bag is empty" text="Add a piece to your bag to check out.">
            <Link to="/shop" className="btn btn--brand"><RollText text="Explore Jewellery" /></Link>
          </EmptyState>
        </div>
      </section>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    const need = { email: 'Enter your email.', first: 'Enter your first name.', last: 'Enter your last name.', address: 'Enter your address.', city: 'Enter your city.', postal: 'Enter your postal code.' }
    Object.entries(need).forEach(([k, m]) => { if (!f[k].trim()) er[k] = m })
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = 'Enter a valid email address.'
    if (pay === 'card') {
      if (f.card.replace(/\s/g, '').length < 16) er.card = 'Enter the 16-digit card number.'
      if (!/^\d{2} \/ \d{2}$/.test(f.exp)) er.exp = 'Use MM / YY.'
      if (!/^\d{3,4}$/.test(f.cvc)) er.cvc = '3 or 4 digits.'
      if (!f.nameOnCard.trim()) er.nameOnCard = 'Enter the name on the card.'
    }
    setErr(er)
    if (Object.keys(er).length) {
      document.querySelector('.has-error input, .has-error select')?.focus()
      return
    }
    const no = `CAL-${1043 + auth.orders.filter((o) => o.no > 'CAL-1042').length}`
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    auth.placeOrder({
      no, date, status: 'Processing', total: cart.total,
      items: cart.items.map((l) => [l.id, `Qty ${l.qty} · ${l.product.metal}${l.option ? ` · ${l.product.option.label === 'Ring size' ? `Size ${l.option}` : l.option}` : ''}`]),
    })
    setPlaced({ no, email: f.email, total: cart.total })
    cart.clear()
  }

  const fade = (d) => ({ initial: { opacity: 0, y: 20 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.8, ease, delay: d } })

  return (
    <>
      <section className="checkout tint">
        <div className="container checkout-grid">
          <form className="checkout-form" onSubmit={submit} noValidate>
            <motion.div {...fade(0)}><Link to="/cart" className="back-link"><Icon name="chevronLeft" size={16} /> Back to cart</Link></motion.div>
            <SplitText as="h1" className="page-title page-title--left" text="Checkout" play={ready} />

            <motion.div className="co-block" {...fade(0.1)}>
              <p className="co-label">Express checkout</p>
              <div className="express">
                <button type="button" className="xpay xpay--paypal" aria-label="Pay with PayPal"><PayPalMark size={18} /> PayPal</button>
                <button type="button" className="xpay xpay--apple" aria-label="Pay with Apple Pay"><AppleMark /> Pay</button>
                <button type="button" className="xpay xpay--google" aria-label="Pay with Google Pay"><GoogleMark /> Pay</button>
              </div>
              <p className="divider"><span>or pay with card</span></p>
            </motion.div>

            <motion.div className="co-block" {...fade(0.15)}>
              <p className="co-label">Contact</p>
              <div className="form-grid">
                <Field label="Email address" type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={set('email')} error={err.email} />
                <Field label="Phone" type="tel" autoComplete="tel" placeholder="+351 900 000 000" value={f.phone} onChange={set('phone')} />
              </div>
            </motion.div>

            <motion.div className="co-block" {...fade(0.2)}>
              <p className="co-label">Shipping details</p>
              <div className="form-grid">
                <Field label="First name" autoComplete="given-name" placeholder="Maya" value={f.first} onChange={set('first')} error={err.first} />
                <Field label="Last name" autoComplete="family-name" placeholder="Laurent" value={f.last} onChange={set('last')} error={err.last} />
                <Field className="span-2" label="Address" autoComplete="street-address" placeholder="123 Botanic Ave" value={f.address} onChange={set('address')} error={err.address} />
                <Field label="City" autoComplete="address-level2" placeholder="Lisbon" value={f.city} onChange={set('city')} error={err.city} />
                <Field label="Postal code" autoComplete="postal-code" placeholder="1200-001" value={f.postal} onChange={set('postal')} error={err.postal} />
                <SelectField className="span-2" label="Country" options={COUNTRIES} value={f.country} onChange={set('country')} />
              </div>
            </motion.div>

            <motion.div className="co-block" {...fade(0.25)}>
              <p className="co-label">Payment</p>
              <div className="pay-opts">
                <div className={`pay-opt ${pay === 'card' ? 'is-on' : ''}`}>
                  <Radio name="pay" checked={pay === 'card'} onChange={() => setPay('card')} className="pay-radio">
                    <strong>Credit / Debit Card</strong>
                    <span className="pay-marks"><em>VISA</em><Icon name="card" size={20} /></span>
                  </Radio>
                  <AnimatePresence initial={false}>
                    {pay === 'card' && (
                      <motion.div className="pay-fields" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>
                        <div className="form-grid">
                          <Field className="span-2" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={f.card} onChange={set('card', fmtCard)} error={err.card} right={<Icon name="card" size={18} className="field-deco" />} />
                          <Field label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={f.exp} onChange={set('exp', fmtExp)} error={err.exp} />
                          <Field label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={f.cvc} onChange={set('cvc', (v) => v.replace(/\D/g, '').slice(0, 4))} error={err.cvc} />
                          <Field className="span-2" label="Name on card" autoComplete="cc-name" placeholder="Maya Laurent" value={f.nameOnCard} onChange={set('nameOnCard')} error={err.nameOnCard} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {[['paypal', 'PayPal', <PayPalMark key="p" size={18} />], ['apple', 'Apple Pay', <AppleMark key="a" />], ['google', 'Google Pay', <GoogleMark key="g" />]].map(([k, label, mark]) => (
                  <div className={`pay-opt ${pay === k ? 'is-on' : ''}`} key={k}>
                    <Radio name="pay" checked={pay === k} onChange={() => setPay(k)} className="pay-radio">
                      <strong>{label}</strong>
                      <span className="pay-marks">{mark}</span>
                    </Radio>
                    <AnimatePresence initial={false}>
                      {pay === k && (
                        <motion.p className="pay-note" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          You’ll confirm the payment with {label} after placing your order.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            <button className="btn btn--brand btn--block co-mobile-submit" type="submit"><RollText text={`Place Order · ${money2(cart.total)}`} /></button>
          </form>

          <motion.aside className="summary summary--sticky" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 0.2 }}>
            <h2 className="h5">Order Summary</h2>
            <ul className="sum-items">
              {cart.items.map((l) => (
                <li key={`${l.id}|${l.option}`}>
                  <span className="sum-thumb"><img src={l.product.img} alt="" /><b>{l.qty}</b></span>
                  <span className="sum-name"><strong>{l.product.name}</strong><small>{l.product.metal}{l.option && ` · ${l.product.option.label === 'Ring size' ? `Size ${l.option}` : l.option}`}</small></span>
                  <span className="sum-price">{money(l.qty * l.product.price)}</span>
                </li>
              ))}
            </ul>
            <Totals compact>
              <button className="btn btn--brand btn--block" type="button" onClick={(e) => submit(e)}><RollText text="Place Order" /></button>
              <p className="sum-secure"><Icon name="lock" size={14} /> Secure SSL encrypted payment</p>
            </Totals>
          </motion.aside>
        </div>
      </section>
      <Bundle />
    </>
  )
}
