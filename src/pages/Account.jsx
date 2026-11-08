import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useNavigate, useOutlet, useLocation } from 'react-router-dom'
import { IMG } from '../images'
import { getProduct, money2 } from '../products'
import { EmptyState, Field, Modal, SelectField, Toggle } from '../components/ui'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'
import { Reveal, RollText, SplitText, ease } from '../components/motion'
import { useAuth, useCart, useReady, useToast } from '../lib/store'

const USER = { name: 'Maya Laurent', email: 'maya.laurent@email.com', since: 2024, phone: '+351 900 000 000', dob: '12 March 1994', address: '123 Botanic Avenue, Alfama, Lisbon 1200-001, Portugal' }

const SIDEBAR = [
  ['user', 'Account overview', '/account'],
  ['package', 'My orders', '/account/orders'],
  ['mapPin', 'Addresses', '/account/addresses'],
  ['card', 'Payment methods', '/account/payments'],
  ['heart', 'Wishlist', '/account/wishlist'],
  ['settings', 'Settings', '/account/settings'],
]

const STATUS = {
  Delivered: ['check', 'is-ok'],
  'In transit': ['truck', 'is-warn'],
  Processing: ['clock', 'is-brand'],
  Cancelled: ['x', 'is-bad'],
}


/* ---------- shared bits ---------- */
function PageTitle({ children, action }) {
  const ready = useReady()
  return (
    <div className="acct-title">
      <SplitText as="h1" className="page-title page-title--left" text={children} play={ready} />
      {action}
    </div>
  )
}


function OrderCard({ o, i, onCancel }) {
  const cart = useCart()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [icon, cls] = STATUS[o.status]
  const buyAgain = () => {
    o.items.forEach(([id]) => { const p = getProduct(id); cart.add(id, p.option?.default ?? null) })
    toast(`${o.items.length} ${o.items.length === 1 ? 'piece' : 'pieces'} added to your bag`)
  }
  return (
    <motion.article className="order" layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease, delay: i * 0.06 }}>
      <header className="order-head">
        <div><strong>Order #{o.no}</strong><small>Placed on {o.date}</small></div>
        <motion.span key={o.status} className={`status ${cls}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Icon name={icon} size={14} stroke={2} /> {o.status}</motion.span>
      </header>
      <ul className="order-items">
        {o.items.map(([id, meta]) => {
          const p = getProduct(id)
          return (
            <li key={id}>
              <Link to={`/product/${id}`}><img src={p.img} alt="" loading="lazy" /></Link>
              <span><Link to={`/product/${id}`}>{p.name}</Link><small>{meta}</small></span>
            </li>
          )
        })}
      </ul>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="order-more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
            <dl>
              <div><dt>Ship to</dt><dd>{USER.address}</dd></div>
              <div><dt>Payment</dt><dd>Visa ending 4242</dd></div>
              <div><dt>Delivery</dt><dd>{o.status === 'Delivered' ? 'Delivered, signed by M. Laurent' : o.status === 'Cancelled' ? 'Refunded to original payment' : 'Standard shipping · 2–4 business days'}</dd></div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="order-foot">
        <p>Total <strong>{money2(o.total)}</strong></p>
        <div className="btn-row">
          {o.status === 'In transit' && <button className="btn btn--brand btn--sm" onClick={() => toast(`Order #${o.no} is out for delivery: arriving tomorrow`)}><RollText text="Track order" /></button>}
          <button className="btn btn--light btn--sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}><RollText text={open ? 'Hide details' : 'View details'} /></button>
          {(o.status === 'Delivered' || o.status === 'Cancelled') && <button className="btn btn--brand btn--sm" onClick={buyAgain}><RollText text="Buy again" /></button>}
          {o.status === 'Processing' && <button className="btn-text" onClick={() => onCancel(o.no)}>Cancel order</button>}
        </div>
      </footer>
    </motion.article>
  )
}

function SignedOut() {
  const ready = useReady()
  return (
    <section className="signed-out tint">
      <div className="container">
        <motion.div className="prompt-card" initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined} transition={{ duration: 0.9, ease }}>
          <motion.span className="empty-icon" initial={{ scale: 0.6, opacity: 0 }} animate={ready ? { scale: 1, opacity: 1 } : undefined} transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.3 }}>
            <Icon name="user" size={28} stroke={1.5} />
          </motion.span>
          <SplitText as="h1" className="h4" text="Sign in to your account" play={ready} delay={0.2} />
          <p className="lede">Access your profile, track your orders, save addresses, and check out faster.</p>
          <div className="btn-row center">
            <Link to="/login" className="btn btn--brand"><RollText text="Sign in" /></Link>
            <Link to="/register" className="btn btn--light"><RollText text="Create account" /></Link>
          </div>
        </motion.div>
        <ul className="perks">
          {[['package', 'Track your orders'], ['mapPin', 'Save your addresses'], ['heart', 'Build a wishlist']].map(([icon, t], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6, ease, delay: 0.5 + i * 0.08 }}>
              <Icon name={icon} size={18} /> {t}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- layout ---------- */
export function AccountLayout() {
  const auth = useAuth()
  const ready = useReady()
  const navigate = useNavigate()
  const outlet = useOutlet()
  const { pathname } = useLocation()
  if (!auth.signedIn) return <SignedOut />
  const signOut = () => { auth.signOut(); navigate('/account') }
  return (
    <section className="account tint">
      <div className="container account-grid">
        <motion.aside className="acct-side" initial={{ opacity: 0, x: -24 }} animate={ready ? { opacity: 1, x: 0 } : undefined} transition={{ duration: 0.8, ease }}>
          <div className="profile-card">
            <img src={IMG.avatar} alt="" className="avatar" />
            <strong>{USER.name}</strong>
            <small>{USER.email}</small>
            <span className="member">Member since {USER.since}</span>
          </div>
          <nav className="acct-nav" aria-label="Account">
            {SIDEBAR.map(([icon, label, to]) => (
              <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {pathname === to && <motion.span layoutId="acct-active" className="acct-active" transition={{ duration: 0.45, ease }} />}
                <Icon name={icon} size={18} /> <span>{label}</span>
              </NavLink>
            ))}
            <button className="acct-signout" onClick={signOut}><Icon name="logout" size={18} /> <span>Sign out</span></button>
          </nav>
        </motion.aside>
        <div className="acct-main">{outlet}</div>
      </div>
    </section>
  )
}

/* ---------- pages ---------- */
export function Overview() {
  const { orders, cancelOrder } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [me, setMe] = useState(USER)
  const [draft, setDraft] = useState(USER)
  const cancel = (no) => { cancelOrder(no); toast(`Order #${no} cancelled`) }
  return (
    <>
      <PageTitle>Account overview</PageTitle>
      <Reveal className="panel" y={24}>
        <div className="panel-head">
          <h2 className="h6">Personal information</h2>
          <button className="btn btn--light btn--sm" onClick={() => { setDraft(me); setEditing(true) }}><RollText text="Edit" /></button>
        </div>
        <dl className="info-grid">
          <div><dt>Full name</dt><dd>{me.name}</dd></div>
          <div><dt>Email address</dt><dd>{me.email}</dd></div>
          <div><dt>Phone</dt><dd>{me.phone}</dd></div>
          <div><dt>Date of birth</dt><dd>{me.dob}</dd></div>
          <div className="span-2"><dt>Default shipping address</dt><dd>{me.address}</dd></div>
        </dl>
      </Reveal>

      <div className="section-row">
        <h2 className="h6">Order history</h2>
        <Link to="/account/orders" className="link-arrow">View all orders <Icon name="arrowRight" size={16} /></Link>
      </div>
      <div className="orders">
        {orders.slice(0, 3).map((o, i) => <OrderCard key={o.no} o={o} i={i} onCancel={cancel} />)}
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit personal information">
        <form className="form-stack" onSubmit={(e) => { e.preventDefault(); setMe(draft); setEditing(false); toast('Your details are saved') }}>
          {[['name', 'Full name'], ['email', 'Email address'], ['phone', 'Phone'], ['dob', 'Date of birth']].map(([k, l]) => (
            <Field key={k} label={l} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
          ))}
          <button className="btn btn--brand btn--block" type="submit"><RollText text="Save changes" /></button>
        </form>
      </Modal>
    </>
  )
}

export function Orders() {
  const { orders, cancelOrder } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('All')
  const map = { Processing: 'Processing', Shipped: 'In transit', Delivered: 'Delivered', Cancelled: 'Cancelled' }
  const list = tab === 'All' ? orders : orders.filter((o) => o.status === map[tab])
  const cancel = (no) => { cancelOrder(no); toast(`Order #${no} cancelled`) }
  return (
    <>
      <PageTitle>My orders</PageTitle>
      <div className="pills" role="tablist" aria-label="Filter orders">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`pill ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>
            {tab === t && <motion.span layoutId="order-pill" className="pill-bg" transition={{ duration: 0.4, ease }} />}
            <span>{t}</span>
          </button>
        ))}
      </div>
      <div className="orders">
        <AnimatePresence mode="popLayout">
          {list.map((o, i) => <OrderCard key={o.no} o={o} i={i} onCancel={cancel} />)}
        </AnimatePresence>
        {!list.length && <p className="muted-note">No {tab.toLowerCase()} orders right now.</p>}
      </div>
    </>
  )
}

const SEED_ADDR = [
  { id: 1, label: 'Home', icon: 'home', name: 'Maya Laurent', line1: '123 Botanic Avenue, Alfama', line2: 'Lisbon 1200-001, Portugal', phone: '+351 900 000 000' },
  { id: 2, label: 'Work', icon: 'briefcase', name: 'Maya Laurent', line1: '45 Rua Augusta, Baixa', line2: 'Lisbon 1100-053, Portugal', phone: '+351 900 111 222' },
  { id: 3, label: 'Parents', icon: 'home', name: 'Ana Laurent', line1: '8 Estrada da Luz', line2: 'Porto 4000-123, Portugal', phone: '+351 900 333 444' },
]
const BLANK = { label: '', name: '', line1: '', line2: '', phone: '' }

export function Addresses() {
  const toast = useToast()
  const [list, setList] = useState(SEED_ADDR)
  const [def, setDef] = useState(1)
  const [edit, setEdit] = useState(null) // address object or 'new'
  const [draft, setDraft] = useState(BLANK)
  const [err, setErr] = useState({})
  const open = (a) => { setDraft(a === 'new' ? BLANK : a); setErr({}); setEdit(a) }
  const save = (e) => {
    e.preventDefault()
    const er = {}
    ;['label', 'name', 'line1', 'line2'].forEach((k) => { if (!draft[k]?.trim()) er[k] = 'Required' })
    setErr(er)
    if (Object.keys(er).length) return
    if (edit === 'new') {
      const id = Date.now()
      setList((l) => [...l, { ...draft, id, icon: /work|office/i.test(draft.label) ? 'briefcase' : 'home' }])
      toast('Address added')
    } else {
      setList((l) => l.map((a) => (a.id === edit.id ? { ...a, ...draft } : a)))
      toast('Address updated')
    }
    setEdit(null)
  }
  const remove = (id) => {
    setList((l) => l.filter((a) => a.id !== id))
    if (def === id) setDef(list.find((a) => a.id !== id)?.id)
    toast('Address deleted')
  }
  const sorted = [...list].sort((a, b) => (a.id === def ? -1 : b.id === def ? 1 : 0))
  return (
    <>
      <PageTitle action={<button className="btn btn--brand" onClick={() => open('new')}><RollText text="Add new address" /></button>}>Addresses</PageTitle>
      <div className="addr-grid">
        <AnimatePresence mode="popLayout">
          {sorted.map((a, i) => (
            <motion.article key={a.id} layout className={`addr ${a.id === def ? 'is-default' : ''}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.55, ease, delay: i * 0.05 }}>
              <header>
                <span className="addr-label"><Icon name={a.icon} size={18} /> {a.label}</span>
                {a.id === def && <motion.span layoutId="addr-default" className="addr-badge"><Icon name="star" size={12} /> Default</motion.span>}
              </header>
              <strong>{a.name}</strong>
              <p>{a.line1}<br />{a.line2}</p>
              {a.phone && <p className="addr-phone">{a.phone}</p>}
              <footer>
                <button className="btn btn--light btn--sm" onClick={() => open(a)}><RollText text="Edit" /></button>
                {a.id !== def && <button className="btn-text" onClick={() => { setDef(a.id); toast(`${a.label} is now your default address`) }}>Set as default</button>}
                <button className="btn-text" onClick={() => remove(a.id)}>Delete</button>
              </footer>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add new address' : 'Edit address'}>
        <form className="form-stack" onSubmit={save} noValidate>
          <Field label="Label" placeholder="Home, Work…" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} error={err.label} />
          <Field label="Full name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} error={err.name} />
          <Field label="Street address" value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} error={err.line1} />
          <Field label="City, postal code, country" value={draft.line2} onChange={(e) => setDraft({ ...draft, line2: e.target.value })} error={err.line2} />
          <Field label="Phone" type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          <button className="btn btn--brand btn--block" type="submit"><RollText text="Save address" /></button>
        </form>
      </Modal>
    </>
  )
}

// Not in the Figma file: kept minimal and in the same visual language.
export function Payments() {
  const toast = useToast()
  return (
    <>
      <PageTitle>Payment methods</PageTitle>
      <Reveal className="panel pay-card-panel" y={24}>
        <div className="saved-card">
          <span className="saved-card-brand">VISA</span>
          <span className="saved-card-no">•••• •••• •••• 4242</span>
          <span className="saved-card-meta"><span>Maya Laurent</span><span>08 / 28</span></span>
        </div>
        <div className="saved-card-info">
          <strong>Visa ending 4242</strong>
          <small>Default · Expires 08/28</small>
          <button className="btn btn--light btn--sm" onClick={() => toast('Card details are managed securely at checkout')}><RollText text="Update card" /></button>
        </div>
      </Reveal>
    </>
  )
}

export function Wishlist() {
  const auth = useAuth()
  const items = auth.wishlist.map(getProduct).filter(Boolean)
  return (
    <>
      <PageTitle>Wishlist</PageTitle>
      {items.length ? (
        <div className="products products--wish">
          {items.map((p, i) => <ProductCard key={p.id} p={p} i={i} variant="product--white" />)}
        </div>
      ) : (
        <div className="panel">
          <EmptyState icon="heart" title="Your wishlist is empty" text="Tap the heart on any piece to save it here.">
            <Link to="/shop" className="btn btn--brand"><RollText text="Explore Jewellery" /></Link>
          </EmptyState>
        </div>
      )}
    </>
  )
}

export function Settings() {
  const toast = useToast()
  const auth = useAuth()
  const navigate = useNavigate()
  const [t, setT] = useState({ twofa: false, orders: true, promos: true, recs: false, news: true })
  const [confirm, setConfirm] = useState(false)
  const flip = (k, label) => (v) => { setT({ ...t, [k]: v }); toast(`${label} ${v ? 'on' : 'off'}`) }
  const ROWS = [
    ['Password', 'Last changed 3 months ago'],
    ['Email address', USER.email],
    ['Phone number', USER.phone],
  ]
  const NOTIF = [
    ['orders', 'Order & shipping updates', 'Get notified about your order status'],
    ['promos', 'Promotions & offers', 'Exclusive deals and seasonal sales'],
    ['recs', 'Product recommendations', 'Personalised picks based on your style'],
    ['news', 'Newsletter', 'Jewellery care and brand stories, monthly'],
  ]
  return (
    <>
      <PageTitle>Settings</PageTitle>
      <Reveal className="panel" y={24}>
        <div className="panel-icon-head"><span className="panel-icon"><Icon name="shield" size={18} /></span><div><h2 className="h6">Login & security</h2><small>Manage your password and account security</small></div></div>
        {ROWS.map(([a, b]) => (
          <div className="set-row" key={a}>
            <span><strong>{a}</strong><small>{b}</small></span>
            <button className="btn btn--light btn--sm" onClick={() => toast(`We’ve emailed you a secure link to change your ${a.toLowerCase()}`)}><RollText text="Change" /></button>
          </div>
        ))}
        <div className="set-row">
          <span><strong>Two-factor authentication</strong><small>Add an extra layer of security to your account</small></span>
          <Toggle checked={t.twofa} onChange={flip('twofa', 'Two-factor authentication')} label="Two-factor authentication" />
        </div>
      </Reveal>

      <Reveal className="panel" y={24}>
        <div className="panel-icon-head"><span className="panel-icon"><Icon name="bell" size={18} /></span><div><h2 className="h6">Notifications</h2><small>Choose what updates you receive</small></div></div>
        {NOTIF.map(([k, a, b]) => (
          <div className="set-row" key={k}>
            <span><strong>{a}</strong><small>{b}</small></span>
            <Toggle checked={t[k]} onChange={flip(k, a)} label={a} />
          </div>
        ))}
      </Reveal>

      <Reveal className="panel" y={24}>
        <div className="panel-icon-head"><span className="panel-icon"><Icon name="globe" size={18} /></span><div><h2 className="h6">Preferences</h2><small>Language, currency and region</small></div></div>
        <div className="pref-grid">
          <SelectField label="Language" options={['English (US)', 'English (UK)', 'Português', 'Español']} defaultValue="English (US)" />
          <SelectField label="Currency" options={['EUR (€)', 'USD ($)', 'GBP (£)']} defaultValue="EUR (€)" />
          <SelectField label="Region" options={['Portugal', 'United States', 'United Kingdom', 'Spain']} defaultValue="Portugal" />
        </div>
      </Reveal>

      <Reveal className="danger" y={24}>
        <Icon name="alert" size={22} />
        <span><strong>Delete account</strong><small>Permanently remove your account and all data. This cannot be undone.</small></span>
        <button className="btn btn--danger btn--sm" onClick={() => setConfirm(true)}><RollText text="Delete account" /></button>
      </Reveal>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Delete your account?">
        <p className="modal-text">Your orders, addresses and wishlist will be removed for good. This cannot be undone.</p>
        <div className="btn-row">
          <button className="btn btn--light" onClick={() => setConfirm(false)}><RollText text="Keep my account" /></button>
          <button className="btn btn--danger-fill" onClick={() => { setConfirm(false); auth.signOut(); toast('Your account has been deleted'); navigate('/') }}><RollText text="Delete for good" /></button>
        </div>
      </Modal>
    </>
  )
}
