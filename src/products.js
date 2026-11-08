import { IMG } from './images'

/*
 * Catalogue. The first 12 match the Figma shop grid exactly; 13 to 24 fill page 2
 * so "Showing 12 of 24" and pagination are real. Category/material counts in the
 * filters are computed from this list, never hard-coded.
 */

const GALLERY_EXTRA = [IMG.flatlay, IMG.hero]

const OPTIONS = {
  Necklaces: { label: 'Chain length', values: ['40 cm', '45 cm', '50 cm'], default: '45 cm' },
  Rings: { label: 'Ring size', values: ['5', '6', '7', '8'], default: '7' },
}

const raw = [
  // page 1 (Figma)
  ['signature-hoops', 'Signature Hoops', 'Earrings', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 24, 4.9, 212, IMG.hoops, IMG.hoopsChunky, ['everyday', 'gift']],
  ['fine-chain-bracelet', 'Fine Chain Bracelet', 'Bracelets', 'Adjustable', '14k Gold Vermeil', 'Polished', 22, 4.8, 164, IMG.bracelet, IMG.braceletStone, ['everyday']],
  ['radiance-pendant', 'Radiance Pendant', 'Necklaces', '18k Gold Plated', '18k Gold Plated', 'Polished', 30.4, 4.9, 128, IMG.pendant, IMG.pendantStone, ['everyday', 'gift'], 38],
  ['everyday-ring', 'Everyday Ring', 'Rings', 'Sterling Silver', 'Sterling Silver', 'Polished', 28, 4.9, 187, IMG.ring, IMG.ringBand, ['everyday']],
  ['mini-hoops', 'Mini Hoops', 'Earrings', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 24, 4.9, 96, IMG.hoops, IMG.hoopsHuggie, ['everyday']],
  ['beaded-bracelet', 'Beaded Bracelet', 'Bracelets', 'Adjustable', '18k Gold Plated', 'Matte', 22, 4.8, 74, IMG.bracelet, IMG.braceletStone, []],
  ['pearl-pendant', 'Pearl Pendant', 'Necklaces', '18k Gold Plated', '18k Gold Plated', 'Polished', 38, 5.0, 58, IMG.pendant, IMG.necklaceStone, ['gift']],
  ['band-ring', 'Band Ring', 'Rings', 'Sterling Silver', 'Sterling Silver', 'Polished', 28, 4.9, 81, IMG.ring, IMG.ringBand, ['everyday']],
  ['huggie-hoops', 'Huggie Hoops', 'Earrings', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 24, 4.9, 142, IMG.hoops, IMG.hoopsHuggie, ['everyday']],
  ['curb-chain-bracelet', 'Curb Chain Bracelet', 'Bracelets', 'Adjustable', '14k Gold Vermeil', 'Polished', 22, 4.8, 66, IMG.bracelet, IMG.braceletStone, []],
  ['bar-pendant', 'Bar Pendant', 'Necklaces', '18k Gold Plated', '18k Gold Plated', 'Matte', 38, 5.0, 49, IMG.pendant, IMG.pendantStone, []],
  ['signet-ring', 'Signet Ring', 'Rings', 'Sterling Silver', 'Sterling Silver', 'Matte', 28, 4.9, 77, IMG.ring, IMG.ringStone, ['gift']],
  // page 2
  ['sculpted-hoops', 'Sculpted Hoops', 'Earrings', '18k Gold Plated', '18k Gold Plated', 'Polished', 32, 4.8, 53, IMG.hoopsChunky, IMG.hoops, ['gift']],
  ['petite-huggies', 'Petite Huggies', 'Earrings', 'Sterling Silver', 'Sterling Silver', 'Polished', 19, 4.7, 61, IMG.hoopsHuggie, IMG.hoops, ['everyday']],
  ['paperclip-bracelet', 'Paperclip Bracelet', 'Bracelets', 'Adjustable', '18k Gold Plated', 'Polished', 26, 4.8, 39, IMG.braceletStone, IMG.bracelet, []],
  ['sculpted-cuff', 'Sculpted Cuff', 'Bracelets', '14k Gold Vermeil', '14k Gold Vermeil', 'Matte', 112, 4.9, 22, IMG.braceletStone, IMG.bracelet, ['gift']],
  ['disc-necklace', 'Disc Necklace', 'Necklaces', '18k Gold Plated', '18k Gold Plated', 'Matte', 34, 4.8, 44, IMG.necklaceStone, IMG.pendant, ['everyday']],
  ['layered-chain-necklace', 'Layered Chain Necklace', 'Necklaces', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 58, 4.9, 37, IMG.pendantStone, IMG.necklaceStone, []],
  ['coin-pendant', 'Coin Pendant', 'Necklaces', '14k Gold Vermeil', '14k Gold Vermeil', 'Matte', 64, 4.8, 28, IMG.necklaceStone, IMG.pendantStone, ['gift']],
  ['stacking-ring', 'Stacking Ring', 'Rings', 'Sterling Silver', 'Sterling Silver', 'Polished', 18, 4.7, 92, IMG.ringBand, IMG.ring, ['everyday']],
  ['dome-ring', 'Dome Ring', 'Rings', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 46, 4.8, 31, IMG.ringStone, IMG.ringBand, []],
  ['twist-ring', 'Twist Ring', 'Rings', 'Sterling Silver', 'Sterling Silver', 'Matte', 24, 4.7, 45, IMG.ringStone, IMG.ring, []],
  ['bridal-hoops', 'Bridal Hoops', 'Earrings', '14k Gold Vermeil', '14k Gold Vermeil', 'Polished', 84, 5.0, 18, IMG.hoopsChunky, IMG.hoopsHuggie, ['gift']],
  ['everyday-gift-set', 'Everyday Gift Set', 'Necklaces', 'Pendant, hoops & ring', '18k Gold Plated', 'Polished', 96, 5.0, 26, IMG.flatlay, IMG.hero, ['gift', 'everyday']],
]

export const PRODUCTS = raw.map(
  ([id, name, category, material, metal, finish, price, rating, reviews, img, alt, tags, compareAt]) => ({
    id, name, category, material, metal, finish, price, rating: rating.toFixed(1), reviews, img,
    gallery: [img, alt, ...GALLERY_EXTRA],
    tags, compareAt,
    option: OPTIONS[category] || null,
  }),
)

export const BEST_SELLERS = PRODUCTS.slice(0, 4)
export const getProduct = (id) => PRODUCTS.find((p) => p.id === id)
export const countIn = (category) => PRODUCTS.filter((p) => p.category === category).length

export const money = (n) => `$${Number(n).toFixed(Number.isInteger(n) ? 0 : 2)}`
export const money2 = (n) => `$${Number(n).toFixed(2)}`

/** Per-product copy. Radiance Pendant uses the exact Figma copy; others are derived. */
export function productCopy(p) {
  if (p.id === 'radiance-pendant') {
    return {
      lede: 'A delicate 18k gold-plated pendant designed to catch light with every movement. Perfect for everyday wear, it pairs effortlessly with simple necklines and layered chains.',
      body: [
        'The Radiance Pendant is cast in brass and finished in 18k gold plate for a warm, sun-kissed glow. Its delicate silhouette is designed to layer beautifully with other necklaces or wear alone for effortless everyday style.',
        'Adjustable chain length makes it easy to find your perfect drape. The lobster clasp secures with a smooth click, and the pendant is polished to a soft, reflective finish that catches light beautifully.',
      ],
      details: [
        ['18k gold-plated finish', 'Warm, sun-kissed finish', 'drop'],
        ['Brass base', 'Durable core', 'drop'],
        ['Adjustable chain', '40 cm / 45 cm / 50 cm', 'leaf'],
        ['Lobster clasp', 'Secure closure', 'leaf'],
      ],
      specs: [
        ['Finish', '18k gold-plated', '—'],
        ['Base', 'Brass', '—'],
        ['Chain', 'Adjustable', '40 cm / 45 cm / 50 cm'],
        ['Clasp', 'Lobster clasp', '—'],
        ['Pendant dimensions', '18 mm x 12 mm', '—'],
        ['Weight', '8.2 g', '—'],
        ['Care', 'Avoid water, polish with soft cloth', '—'],
      ],
    }
  }
  const kind = { Earrings: 'pair', Rings: 'ring', Necklaces: 'necklace', Bracelets: 'bracelet' }[p.category]
  const base = p.metal === 'Sterling Silver' ? 'Solid 925 sterling silver' : p.metal === '14k Gold Vermeil' ? 'Sterling silver' : 'Brass'
  return {
    lede: `A ${p.finish.toLowerCase()} ${p.metal.toLowerCase()} ${kind} made for everyday wear. Wear it alone for a quiet finish or layer it with your favourite pieces.`,
    body: [
      `The ${p.name} is finished in ${p.metal.toLowerCase()} with a ${p.finish.toLowerCase()} surface that catches soft light. Its clean silhouette sits comfortably from morning to evening.`,
      'Designed to mix and match: pair it with other Pearlarry pieces to build a look that feels like you.',
    ],
    details: [
      [`${p.metal} finish`, p.finish === 'Matte' ? 'Soft, brushed glow' : 'Bright, reflective shine', 'drop'],
      [`${base} base`, 'Durable core', 'drop'],
      [p.option ? p.option.label : 'One size', p.option ? p.option.values.join(' / ') : p.material, 'leaf'],
      ['Nickel-free', 'Gentle on skin', 'leaf'],
    ],
    specs: [
      ['Finish', p.metal, '—'],
      ['Base', base, '—'],
      ['Surface', p.finish, '—'],
      [p.option ? p.option.label : 'Size', p.option ? 'Choose at checkout' : 'One size', p.option ? p.option.values.join(' / ') : '—'],
      ['Care', 'Avoid water, polish with soft cloth', '—'],
    ],
  }
}
