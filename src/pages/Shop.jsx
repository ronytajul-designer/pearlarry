import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../products'
import { PageHeader, Checkbox, Dropdown } from '../components/ui'
import ProductCard from '../components/ProductCard'
import Cta from '../sections/Cta'
import Icon from '../components/Icon'
import { ease } from '../components/motion'
import { useScrollTo } from '../lib/smooth'

const PER_PAGE = 12

const GROUPS = [
  {
    key: 'category', title: 'Category',
    options: [
      ['Rings', (p) => p.category === 'Rings'],
      ['Necklaces', (p) => p.category === 'Necklaces'],
      ['Earrings', (p) => p.category === 'Earrings'],
      ['Bracelets', (p) => p.category === 'Bracelets'],
      ['Everyday Edit', (p) => p.tags.includes('everyday')],
      ['Gifts', (p) => p.tags.includes('gift')],
    ],
  },
  {
    key: 'material', title: 'Materials / Finish',
    options: [
      ['14k Gold Vermeil', (p) => p.metal === '14k Gold Vermeil'],
      ['18k Gold Plated', (p) => p.metal === '18k Gold Plated'],
      ['Sterling Silver', (p) => p.metal === 'Sterling Silver'],
      ['Polished', (p) => p.finish === 'Polished'],
      ['Matte', (p) => p.finish === 'Matte'],
    ],
  },
  {
    key: 'price', title: 'Price',
    options: [
      ['Under $25', (p) => p.price < 25],
      ['$25 – $50', (p) => p.price >= 25 && p.price <= 50],
      ['$50 – $100', (p) => p.price > 50 && p.price <= 100],
      ['Over $100', (p) => p.price > 100],
    ],
  },
]

const SORTS = {
  Featured: null,
  'Price: low to high': (a, b) => a.price - b.price,
  'Price: high to low': (a, b) => b.price - a.price,
  'Top rated': (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  'Most reviewed': (a, b) => b.reviews - a.reviews,
}

const read = (params, key) => (params.get(key) ? params.get(key).split(',') : [])

function Filters({ params, toggle, clear, active }) {
  return (
    <div className="filters">
      <div className="filters-head">
        <p className="filters-title"><Icon name="sliders" size={20} /> Filters</p>
        {active > 0 && <button className="filters-clear" onClick={clear}>Clear all</button>}
      </div>
      {GROUPS.map((g) => {
        const on = read(params, g.key)
        return (
          <fieldset className="filter-group" key={g.key}>
            <legend>{g.title}</legend>
            {g.options.map(([label, test]) => (
              <Checkbox
                key={label}
                label={label}
                count={PRODUCTS.filter(test).length}
                checked={on.includes(label)}
                onChange={() => toggle(g.key, label)}
              />
            ))}
          </fieldset>
        )
      })}
    </div>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const scrollTo = useScrollTo()
  const sort = params.get('sort') || 'Featured'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const q = (params.get('q') || '').trim()

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      GROUPS.every((g) => {
        const on = read(params, g.key)
        return !on.length || g.options.some(([label, test]) => on.includes(label) && test(p))
      }),
    )
    if (q) {
      const t = q.toLowerCase()
      list = list.filter((p) => `${p.name} ${p.category} ${p.metal} ${p.material}`.toLowerCase().includes(t))
    }
    if (SORTS[sort]) list = [...list].sort(SORTS[sort])
    return list
  }, [params, q, sort])

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const activeChips = GROUPS.flatMap((g) => read(params, g.key).map((v) => [g.key, v]))

  const update = (fn, keepPage = false) => {
    const next = new URLSearchParams(params)
    fn(next)
    if (!keepPage) next.delete('page')
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const toggle = (key, label) =>
    update((n) => {
      const on = read(n, key)
      const v = on.includes(label) ? on.filter((x) => x !== label) : [...on, label]
      v.length ? n.set(key, v.join(',')) : n.delete(key)
    })
  const clear = () => update((n) => { GROUPS.forEach((g) => n.delete(g.key)); n.delete('q') })
  const goPage = (p) => {
    update((n) => (p > 1 ? n.set('page', p) : n.delete('page')), true)
    scrollTo('#shop-results', { duration: 1 })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', drawer)
    return () => document.documentElement.classList.remove('no-scroll')
  }, [drawer])

  const gridKey = `${current}|${sort}|${params.toString()}`

  return (
    <>
      <PageHeader
        eyebrow="Shop all"
        title="Jewellery for every moment"
        lede="Explore our full range of modern, wearable pieces — thoughtfully made for everyday style."
      />

      <section className="section shop" id="shop-results">
        <div className="container shop-layout">
          <aside className="shop-aside" aria-label="Filters">
            <Filters params={params} toggle={toggle} clear={clear} active={activeChips.length + (q ? 1 : 0)} />
          </aside>

          <div className="shop-main">
            <div className="shop-toolbar">
              <button className="btn btn--light btn--sm shop-filter-btn" onClick={() => setDrawer(true)}>
                <Icon name="sliders" size={18} /> Filters{activeChips.length ? ` (${activeChips.length})` : ''}
              </button>
              <p className="shop-count" aria-live="polite">
                Showing {shown.length} of {results.length} {results.length === 1 ? 'product' : 'products'}
              </p>
              <Dropdown
                className="sort"
                align="right"
                prefix="Sort by:"
                value={sort}
                options={Object.keys(SORTS)}
                onChange={(v) => update((n) => (v === 'Featured' ? n.delete('sort') : n.set('sort', v)))}
              />
            </div>

            <AnimatePresence initial={false}>
              {(activeChips.length > 0 || q) && (
                <motion.div className="chips" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                  {q && (
                    <button className="chip" onClick={() => update((n) => n.delete('q'))}>
                      “{q}” <Icon name="x" size={14} />
                    </button>
                  )}
                  {activeChips.map(([k, v]) => (
                    <button key={k + v} className="chip" onClick={() => toggle(k, v)} aria-label={`Remove filter ${v}`}>
                      {v} <Icon name="x" size={14} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={gridKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
              >
                {shown.length ? (
                  <div className="shop-grid">
                    {shown.map((p, i) => <ProductCard key={p.id} p={p} i={i} variant="product--grid" />)}
                  </div>
                ) : (
                  <div className="shop-empty">
                    <Icon name="search" size={28} />
                    <h2 className="h5">No pieces match these filters</h2>
                    <p className="lede">Try removing a filter or two to see more of the collection.</p>
                    <button className="btn btn--brand" onClick={clear}>Clear all filters</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {pages > 1 && (
              <nav className="pager" aria-label="Pagination">
                <button className="pager-btn" onClick={() => goPage(current - 1)} disabled={current === 1} aria-label="Previous page"><Icon name="chevronLeft" size={18} /></button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={`pager-btn ${n === current ? 'is-active' : ''}`} onClick={() => goPage(n)} aria-current={n === current ? 'page' : undefined}>
                    {n}
                  </button>
                ))}
                <button className="pager-btn" onClick={() => goPage(current + 1)} disabled={current === pages} aria-label="Next page"><Icon name="chevronRight" size={18} /></button>
              </nav>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.55, ease }}
              data-lenis-prevent
            >
              <button className="icon-btn drawer-close" onClick={() => setDrawer(false)} aria-label="Close filters"><Icon name="x" size={20} /></button>
              <Filters params={params} toggle={toggle} clear={clear} active={activeChips.length} />
              <div className="drawer-foot">
                <button className="btn btn--brand" onClick={() => setDrawer(false)}>
                  Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Cta />
    </>
  )
}
