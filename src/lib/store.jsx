import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getProduct } from '../products'

/* ---------- tiny persisted state helper (storage can be blocked: never trust it) ---------- */
function usePersisted(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ }
  }, [key, v])
  return [v, setV]
}

/* ---------- ready: true once the intro preloader has finished ---------- */
export const ReadyCtx = createContext(true)
export const useReady = () => useContext(ReadyCtx)

/* ---------- toasts ---------- */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

function Toasts({ items }) {
  return (
    <div className="toasts" aria-live="polite" role="status">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="toast-dot" aria-hidden="true" />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------- cart ---------- */
const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

// First visit shows the bag from the Figma file (3 items) so every screen matches the design.
const SEED = [
  { id: 'radiance-pendant', option: '45 cm', qty: 1 },
  { id: 'signature-hoops', option: null, qty: 1 },
  { id: 'everyday-ring', option: '7', qty: 1 },
]

export const PROMOS = { WELCOME15: 0.15 }
export const TAX_RATE = 0.08
export const FREE_SHIPPING_FROM = 50
export const SHIPPING_FEE = 4.95
export const EXPRESS_FEE = 9.9

/* ---------- account ---------- */
export const SEED_ORDERS = [
  { no: 'CAL-1042', date: 'Jul 2, 2026', status: 'Delivered', total: 62, items: [['radiance-pendant', 'Qty 1 · 18k gold plated · 45 cm'], ['signature-hoops', 'Qty 1 · 14k gold vermeil']] },
  { no: 'CAL-1038', date: 'Jun 24, 2026', status: 'In transit', total: 50, items: [['everyday-ring', 'Qty 1 · Sterling silver · Size 7'], ['fine-chain-bracelet', 'Qty 1']] },
  { no: 'CAL-1031', date: 'Jun 12, 2026', status: 'Processing', total: 38, items: [['radiance-pendant', 'Qty 1 · 18k gold plated · 45 cm']] },
  { no: 'CAL-1004', date: 'May 3, 2026', status: 'Cancelled', total: 22, items: [['fine-chain-bracelet', 'Qty 1']] },
]

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function StoreProvider({ children }) {
  const [lines, setLines] = usePersisted('pl-cart', SEED)
  const [promo, setPromo] = usePersisted('pl-promo', null)
  const [method, setMethod] = usePersisted('pl-ship', 'standard')
  const [signedIn, setSignedIn] = usePersisted('pl-auth', true)
  const [wishlist, setWishlist] = usePersisted('pl-wish', ['radiance-pendant'])
  const [orders, setOrders] = usePersisted('pl-orders', SEED_ORDERS)
  const [toasts, setToasts] = useState([])
  const tid = useRef(0)

  const toast = useCallback((text) => {
    const id = ++tid.current
    setToasts((t) => [...t.slice(-2), { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const cart = useMemo(() => {
    const items = lines
      .map((l) => ({ ...l, product: getProduct(l.id) }))
      .filter((l) => l.product)
    const count = items.reduce((n, l) => n + l.qty, 0)
    const subtotal = items.reduce((n, l) => n + l.qty * l.product.price, 0)
    const discount = promo && PROMOS[promo] ? subtotal * PROMOS[promo] : 0
    const standard = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
    const shipping = subtotal === 0 ? 0 : method === 'express' ? EXPRESS_FEE : standard
    const tax = (subtotal - discount) * TAX_RATE
    const total = subtotal - discount + shipping + tax
    const key = (id, option) => `${id}|${option ?? ''}`
    return {
      items, count, subtotal, discount, shipping, tax, total, promo, method, setMethod,
      add: (id, option = null, qty = 1) => {
        setLines((ls) => {
          const k = key(id, option)
          const hit = ls.find((l) => key(l.id, l.option) === k)
          return hit ? ls.map((l) => (key(l.id, l.option) === k ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, option, qty }]
        })
      },
      setQty: (id, option, qty) =>
        setLines((ls) => ls.map((l) => (key(l.id, l.option) === key(id, option) ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))),
      remove: (id, option) => setLines((ls) => ls.filter((l) => key(l.id, l.option) !== key(id, option))),
      clear: () => { setLines([]); setPromo(null) },
      applyPromo: (code) => {
        const c = code.trim().toUpperCase()
        if (PROMOS[c]) { setPromo(c); return true }
        return false
      },
      removePromo: () => setPromo(null),
    }
  }, [lines, promo, method, setLines, setPromo, setMethod])

  const auth = useMemo(() => ({
    signedIn,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    wishlist,
    toggleWish: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    orders,
    placeOrder: (o) => setOrders((os) => [o, ...os]),
    cancelOrder: (no) => setOrders((os) => os.map((o) => (o.no === no ? { ...o, status: 'Cancelled' } : o))),
  }), [signedIn, setSignedIn, wishlist, setWishlist, orders, setOrders])

  return (
    <ToastCtx.Provider value={toast}>
      <AuthCtx.Provider value={auth}>
        <CartCtx.Provider value={cart}>
          {children}
          <Toasts items={toasts} />
        </CartCtx.Provider>
      </AuthCtx.Provider>
    </ToastCtx.Provider>
  )
}
