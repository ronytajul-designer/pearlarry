import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PRODUCTS, getProduct, money, productCopy, BEST_SELLERS } from '../products'
import { Breadcrumb, Field, Modal, Qty, Radio, Stars } from '../components/ui'
import ProductCard, { ProductRow } from '../components/ProductCard'
import Icon from '../components/Icon'
import { Reveal, RollText, SplitText, ease } from '../components/motion'
import { useAuth, useCart, useReady, useToast, EXPRESS_FEE } from '../lib/store'
import { useScrollTo } from '../lib/smooth'
import NotFound from './NotFound'
import FaqSection from '../components/FaqSection'

// Q1 answer is from Figma; Q2 to Q5 are placeholder copy until real policy text exists.
const faqFor = (p) => [
  { q: `What is the ${p.category === 'Necklaces' ? 'pendant' : 'piece'} made from?`, a: p.id === 'radiance-pendant' ? 'The Radiance Pendant has an 18k gold-plated finish over brass. Choose a 40 cm, 45 cm or 50 cm chain. Wipe with a soft cloth and keep away from water and perfume.' : `The ${p.name} is finished in ${p.metal.toLowerCase()} with a ${p.finish.toLowerCase()} surface. See the specifications below for every detail.` },
  { q: p.metal === 'Sterling Silver' ? 'Will the silver tarnish?' : 'How long does the gold plating last?', a: p.metal === 'Sterling Silver' ? 'Sterling silver can darken over time. A quick polish with a soft cloth brings back the shine.' : 'With everyday care the finish keeps its colour for a long time. Taking it off before showering, swimming or applying lotion helps it last longer.' },
  { q: 'Can I wear it in water?', a: 'We recommend removing it before swimming, showering or exercising. Water, chlorine and sweat wear finishes down faster.' },
  { q: 'How should I clean it?', a: 'Wipe gently with a soft, dry cloth after wear. Avoid jewellery dips and abrasive cleaners.' },
  { q: 'Is it nickel-free?', a: 'Yes. Every Pearlarry piece is nickel-free and suitable for most sensitive skin.' },
]

const CARE = [
  ['Clean', 'Gently wipe with a soft, dry cloth after wear.'],
  ['Dry', 'Dry thoroughly before storing to prevent moisture buildup.'],
  ['Store', 'Store in a cool, dry place away from direct sunlight.'],
  ['Protect', 'Avoid contact with perfume, chlorine, or abrasive cleaners.'],
]

const DIST = [[5, 82], [4, 12], [3, 4], [2, 1], [1, 1]]

const SEED_REVIEWS = [
  { n: 'Sofia L.', r: 5, t: '2 weeks ago', b: 'This pendant catches light beautifully and layers perfectly with my everyday chains. The gold finish feels premium and the chain is easy to adjust.' },
  { n: 'James M.', r: 5, t: '1 month ago', b: 'Simple, elegant, and easy to wear. The clasp is secure and the pendant sits nicely on the neck. Great value for the quality.' },
  { n: 'Amara K.', r: 5, t: '1 month ago', b: 'The gold finish is warm and flattering, and the pendant feels sturdy without being heavy. I wear it every day and get so many compliments.' },
  { n: 'Hana T.', r: 4, t: '2 months ago', b: 'Lovely everyday piece. I went for the shorter length and it sits right at the collarbone. Packaging was beautiful too.', photo: true },
  { n: 'Chloe R.', r: 5, t: '2 months ago', b: 'Bought it as a gift and ended up ordering one for myself. Delicate but not flimsy.' },
  { n: 'Priya S.', r: 5, t: '3 months ago', b: 'Exactly as pictured. The finish has stayed bright after weeks of daily wear.', photo: true },
]

const initials = (n) => n.split(' ').map((x) => x[0]).join('').replace('.', '')

function Gallery({ p }) {
  const auth = useAuth()
  const toast = useToast()
  const [[idx, dir], set] = useState([0, 0])
  const n = p.gallery.length
  const go = (d) => set(([i]) => [(i + d + n) % n, d])
  const wished = auth.wishlist.includes(p.id)
  return (
    <div className="gallery">
      <div className="gallery-main">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={idx}
            src={p.gallery[idx]}
            alt={`${p.name}, view ${idx + 1} of ${n}`}
            custom={dir}
            variants={{
              enter: (d) => ({ opacity: 0, x: d * 60, scale: 1.04 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, i) => Math.abs(i.offset.x) > 50 && go(i.offset.x < 0 ? 1 : -1)}
          />
        </AnimatePresence>
        <motion.button
          className={`gallery-wish ${wished ? 'is-on' : ''}`}
          onClick={() => { auth.toggleWish(p.id); toast(wished ? 'Removed from your wishlist' : 'Saved to your wishlist') }}
          whileTap={{ scale: 0.85 }}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <motion.span animate={wished ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
            <Icon name="heart" size={20} stroke={1.8} />
          </motion.span>
        </motion.button>
        <button className="gallery-nav gallery-nav--prev" onClick={() => go(-1)} aria-label="Previous image"><Icon name="chevronLeft" size={20} /></button>
        <button className="gallery-nav gallery-nav--next" onClick={() => go(1)} aria-label="Next image"><Icon name="chevronRight" size={20} /></button>
      </div>
      <div className="gallery-thumbs">
        {p.gallery.map((src, i) => (
          <button key={i} className={`gallery-thumb ${i === idx ? 'is-active' : ''}`} onClick={() => set([i, i > idx ? 1 : -1])} aria-label={`Show image ${i + 1}`}>
            <img src={src} alt="" loading="lazy" />
            {i === idx && <motion.span layoutId="thumb-active" className="gallery-thumb-ring" transition={{ duration: 0.5, ease }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

function Reviews({ p }) {
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const [more, setMore] = useState(false)
  const [writing, setWriting] = useState(false)
  const [mine, setMine] = useState([])
  const [form, setForm] = useState({ r: 5, n: '', b: '' })
  const [err, setErr] = useState({})

  const all = [...mine, ...SEED_REVIEWS]
  const filtered = all.filter((r) => filter === 'All' || (filter === 'With photos' ? r.photo : r.r === Number(filter[0])))
  const list = more ? filtered : filtered.slice(0, 3)

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!form.n.trim()) er.n = 'Please add your name.'
    if (form.b.trim().length < 10) er.b = 'Tell us a little more (10 characters or more).'
    setErr(er)
    if (Object.keys(er).length) return
    setMine((m) => [{ n: form.n.trim(), r: form.r, t: 'Just now', b: form.b.trim(), you: true }, ...m])
    setForm({ r: 5, n: '', b: '' })
    setWriting(false)
    setFilter('All')
    toast('Thank you. Your review is live.')
  }

  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <SplitText as="h2" className="h4" text="Customer reviews" />
        <div className="reviews-summary">
          <Reveal className="reviews-score">
            <strong>{p.rating}</strong>
            <Stars value={Number(p.rating)} size={20} />
            <span>Based on {p.reviews} reviews</span>
          </Reveal>
          <div className="reviews-bars">
            {DIST.map(([s, pct], i) => (
              <div className="rbar" key={s}>
                <span className="rbar-label">{s} <Icon name="star" size={12} /></span>
                <span className="rbar-track">
                  <motion.span className="rbar-fill" initial={{ scaleX: 0 }} whileInView={{ scaleX: pct / 100 }} viewport={{ once: true }} transition={{ duration: 1.2, ease, delay: i * 0.08 }} />
                </span>
                <span className="rbar-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-tools">
          <div className="pills" role="tablist" aria-label="Filter reviews">
            {['All', '5 ★', '4 ★', '3 ★', '2 ★', '1 ★', 'With photos'].map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={`pill ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
                {filter === f && <motion.span layoutId="review-pill" className="pill-bg" transition={{ duration: 0.4, ease }} />}
                <span>{f}</span>
              </button>
            ))}
          </div>
          <button className="btn btn--light" onClick={() => setWriting(true)}><RollText text="Write a review" /></button>
        </div>

        <ul className="review-list">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((r) => (
              <motion.li key={r.n + r.b} className="review" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}>
                <span className="review-avatar" aria-hidden="true">{initials(r.n)}</span>
                <div className="review-body">
                  <p className="review-head">
                    <strong>{r.n}</strong>
                    <span className="verified"><Icon name="check" size={12} stroke={2.4} /> {r.you ? 'You' : 'Verified'}</span>
                    <time>{r.t}</time>
                  </p>
                  <Stars value={r.r} size={15} />
                  <p>{r.b}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {!list.length && <li className="review-none">No reviews match this filter yet.</li>}
        </ul>

        {filtered.length > 3 && (
          <div className="center">
            <button className="btn btn--light" onClick={() => setMore((m) => !m)}>
              <RollText text={more ? 'Show fewer reviews' : 'Load more reviews'} />
            </button>
          </div>
        )}
      </div>

      <Modal open={writing} onClose={() => setWriting(false)} title="Write a review">
        <form className="form-stack" onSubmit={submit} noValidate>
          <div className="field">
            <span className="field-label">Your rating</span>
            <div className="star-input" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} role="radio" aria-checked={form.r === s} aria-label={`${s} star${s > 1 ? 's' : ''}`} onClick={() => setForm({ ...form, r: s })} className={s <= form.r ? 'is-on' : ''}>
                  <Icon name="star" size={26} />
                </button>
              ))}
            </div>
          </div>
          <Field label="Name" placeholder="Maya L." value={form.n} onChange={(e) => setForm({ ...form, n: e.target.value })} error={err.n} />
          <Field label="Your review" as="textarea" rows={4} placeholder="How does it look and feel?" value={form.b} onChange={(e) => setForm({ ...form, b: e.target.value })} error={err.b} />
          <button className="btn btn--brand btn--block" type="submit"><RollText text="Post review" /></button>
        </form>
      </Modal>
    </section>
  )
}

export default function Product() {
  const { id } = useParams()
  const p = getProduct(id)
  const ready = useReady()
  const cart = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const scrollTo = useScrollTo()
  const [qty, setQty] = useState(1)
  const [opt, setOpt] = useState(p?.option?.default ?? null)

  useEffect(() => { setQty(1); setOpt(p?.option?.default ?? null) }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!p) return []
    const same = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id)
    return [...same, ...BEST_SELLERS.filter((x) => x.id !== p.id && x.category !== p.category)].slice(0, 4)
  }, [p])

  if (!p) return <NotFound />
  const copy = productCopy(p)
  const best = BEST_SELLERS.some((b) => b.id === p.id)
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0

  const addToBag = () => {
    cart.add(p.id, opt, qty)
    toast(`${qty} × ${p.name} added to your bag`)
  }
  const buyNow = () => { cart.add(p.id, opt, qty); navigate('/checkout') }
  const fade = (d) => ({ initial: { opacity: 0, y: 18 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.8, ease, delay: d } })

  return (
    <>
      <section className="pdp tint">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Our Jewellery', to: '/shop' }, { label: p.name }]} />
          <div className="pdp-grid">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={ready ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1, ease }}>
              <Gallery p={p} />
            </motion.div>

            <div className="pdp-info">
              <motion.p className="eyebrow" {...fade(0.1)}>{best ? 'Bestseller' : p.category}</motion.p>
              <SplitText as="h1" className="pdp-title" text={p.name} play={ready} delay={0.15} />
              <motion.button className="pdp-rating" onClick={() => scrollTo('#reviews')} {...fade(0.25)}>
                <Stars value={Number(p.rating)} size={18} /> <strong>{p.rating}</strong> <span>· {p.reviews} reviews</span>
              </motion.button>
              <motion.p className="pdp-price" {...fade(0.3)}>
                <strong>{money(p.price)}</strong>
                {p.compareAt && <><s>{money(p.compareAt)}</s><span className="pdp-off">−{off}%</span></>}
              </motion.p>
              <motion.p className="pdp-lede" {...fade(0.35)}>{copy.lede}</motion.p>

              <motion.div className="pdp-opts" {...fade(0.42)}>
                <div className="pdp-opt">
                  <span className="field-label">Quantity</span>
                  <Qty value={qty} onChange={setQty} />
                </div>
                {p.option && (
                  <div className="pdp-opt">
                    <span className="field-label" id="opt-label">{p.option.label}</span>
                    <div className="opt-chips" role="radiogroup" aria-labelledby="opt-label">
                      {p.option.values.map((v) => (
                        <button key={v} role="radio" aria-checked={opt === v} className={`opt-chip ${opt === v ? 'is-on' : ''}`} onClick={() => setOpt(v)}>
                          {opt === v && <motion.span layoutId="opt-ring" className="opt-ring" transition={{ duration: 0.4, ease }} />}
                          <span>{v}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pdp-opt">
                  <span className="field-label">Delivery method</span>
                  <div className="ship-opts">
                    <Radio name="ship" checked={cart.method === 'standard'} onChange={() => cart.setMethod('standard')} className="ship-opt">
                      <span className="ship-text"><strong>Standard shipping</strong><small>2–4 business days</small></span>
                      <span className="ship-price">Free</span>
                    </Radio>
                    <Radio name="ship" checked={cart.method === 'express'} onChange={() => cart.setMethod('express')} className="ship-opt">
                      <span className="ship-text"><strong>Express shipping</strong><small>1–2 business days</small></span>
                      <span className="ship-price">{money(EXPRESS_FEE)}</span>
                    </Radio>
                  </div>
                </div>
              </motion.div>

              <motion.div className="pdp-actions" {...fade(0.5)}>
                <button className="btn btn--light" onClick={addToBag}><RollText text="Add to cart" /></button>
                <button className="btn btn--brand" onClick={buyNow}><RollText text="Checkout" /></button>
              </motion.div>

              <motion.ul className="trust" {...fade(0.58)}>
                <li><Icon name="truck" size={20} /><span><strong>Free shipping over $50</strong><small>Standard shipping · 2–4 business days</small></span></li>
                <li><Icon name="refresh" size={20} /><span><strong>30-day easy returns</strong><small>Not satisfied? Return for a full refund</small></span></li>
                <li><Icon name="shield" size={20} /><span><strong>Secure checkout</strong><small>SSL encrypted payment, guaranteed safe</small></span></li>
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section pdp-details">
        <div className="container pdp-details-grid">
          <div>
            <SplitText as="h2" className="h4" text="Description" />
            {copy.body.map((t, i) => <Reveal as="p" className="pdp-body" key={i} delay={i * 0.1} y={16}>{t}</Reveal>)}

            <SplitText as="h3" className="h5 pdp-sub" text="Design details/materials" />
            <div className="detail-cards">
              {copy.details.map(([t, s, icon], i) => (
                <Reveal className="detail-card" key={t} delay={i * 0.06} y={20}>
                  <span className="detail-icon"><Icon name={icon} size={18} /></span>
                  <span><strong>{t}</strong><small>{s}</small></span>
                </Reveal>
              ))}
            </div>

            <SplitText as="h3" className="h5 pdp-sub" text="Specifications" />
            <Reveal className="spec-wrap" y={20}>
              <table className="spec">
                <thead><tr><th>Detail</th><th>Specification</th><th>Options</th></tr></thead>
                <tbody>
                  {copy.specs.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}
                </tbody>
              </table>
            </Reveal>
          </div>

          <Reveal className="care-card" y={30}>
            <h3 className="h5">Jewellery care</h3>
            <ol>
              {CARE.map(([t, d], i) => (
                <li key={t}>
                  <span className="care-num">{i + 1}</span>
                  <span><strong>{t}</strong><small>{d}</small></span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <FaqSection items={faqFor(p)} id="product-faq" />

      <Reviews p={p} />

      <section className="section related">
        <div className="container">
          <div className="best-head">
            <SplitText as="h2" className="h4" text="You might also like" />
            <Link to="/shop" className="link-underline">View All Jewellery</Link>
          </div>
          <ProductRow>
            {related.map((r, i) => <ProductCard key={r.id} p={r} i={i} group />)}
          </ProductRow>
        </div>
      </section>
    </>
  )
}
