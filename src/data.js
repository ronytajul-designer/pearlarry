import { IMG } from './images'

export { IMG }

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Our Jewellery', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

import { countIn } from './products'
export { PRODUCTS, BEST_SELLERS, getProduct } from './products'

export const FEATURES_LEFT = [
  { icon: 'leaf', title: 'Thoughtful materials', text: 'Discover 14k gold vermeil, 18k gold plating, and sterling silver across our collection.' },
  { icon: 'flask', title: 'An adjustable fit', text: 'Find your fit with the Fine Chain Bracelet, designed with an adjustable length.' },
  { icon: 'shield', title: 'A personal touch', text: 'Choose the pieces that speak to you, from a simple silver ring to a golden pendant.' },
  { icon: 'sparkles', title: 'Honestly priced', text: 'Quality pieces at accessible prices, so you can collect the pieces you love.' },
]
export const FEATURES_RIGHT = [
  { icon: 'package', title: 'Radically transparent', text: 'Find material details and sizing information alongside each piece before you choose.' },
  { icon: 'heart', title: 'Timeless & versatile', text: 'Simple silhouettes that work alone or together, from a quiet morning to an evening out.' },
  { icon: 'smile', title: 'Made for every style', text: 'Minimalist essentials and statement pieces that layer together effortlessly.' },
  { icon: 'world', title: 'Your everyday edit', text: 'Hoops, rings, necklaces, and bracelets to mix, match, and make your own.' },
]

const NECK = { single: IMG.neckSingle, layered: IMG.neckLayered, alt: 'Radiance Pendant worn alone and layered with fine chains', pos: '50% 70%' }
const HAND = { single: IMG.handSingle, layered: IMG.handLayered, alt: 'Everyday Ring worn alone and stacked with the Fine Chain Bracelet', pos: '50% 55%' }

// The Figma file ships two comparison pairs. Swap in look-specific imagery per tab when available.
export const LOOKS = [
  { id: 'layering', label: 'Everyday Layering', pairs: [NECK, HAND] },
  { id: 'desk', label: 'Desk-to-Dinner', pairs: [HAND, NECK] },
  { id: 'minimal', label: 'Minimalist Chic', pairs: [NECK, HAND] },
  { id: 'statement', label: 'Statement Looks', pairs: [HAND, NECK] },
]

// Counts come from the product catalogue so the homepage never disagrees with the shop.
export const CATEGORIES = [
  { name: 'Rings', count: countIn('Rings'), img: IMG.ring, area: 'a' },
  { name: 'Necklaces', count: countIn('Necklaces'), img: IMG.pendant, area: 'b' },
  { name: 'Earrings', count: countIn('Earrings'), img: IMG.hoops, area: 'c' },
  { name: 'Bracelets', count: countIn('Bracelets'), img: IMG.bracelet, area: 'd' },
]

export const TESTIMONIALS = [
  {
    name: 'Lauren M.', place: 'Brooklyn, NY', img: IMG.hoops,
    title: 'The Signature Hoops instantly elevate my everyday look.',
    quote: 'I pair them with the Everyday Ring and Fine Chain Bracelet for a polished look that feels effortless.',
  },
  {
    name: 'Maya S.', place: 'London, UK', img: IMG.pendant,
    title: 'The Radiance Pendant adds a touch of sophistication to any outfit.',
    quote: 'I wear it alone for work and layered with the Signature Hoops for a night out.',
  },
  {
    name: 'Rina W.', place: 'Jakarta, ID', img: IMG.bracelet,
    title: 'The Fine Chain Bracelet is my go-to everyday staple.',
    quote: 'It layers beautifully with the Everyday Ring and adds a subtle shine to any look.',
  },
]

// Only the first answer exists in Figma. The rest are placeholder copy: replace with real policy text.
export const FAQS = [
  {
    q: 'What materials are Pearlarry jewellery pieces made from?',
    a: 'Signature Hoops feature 14k gold vermeil, the Radiance Pendant is 18k gold plated, and the Everyday Ring is sterling silver. See each piece for details.',
  },
  {
    q: 'Do you offer sizing guidance and fit recommendations?',
    a: 'Yes. Every product page lists measurements and sizing notes, and the Fine Chain Bracelet has an adjustable length. Our care team can help you pick a size before you order.',
  },
  {
    q: 'How should I care for my Pearlarry jewellery?',
    a: 'Keep pieces dry, take them off before swimming or applying lotion, and store them separately in the pouch they arrive in. Wipe gently with a soft cloth to keep the shine.',
  },
  {
    q: 'Can I return or exchange a piece if the fit isn’t right?',
    a: 'Unworn pieces in their original packaging can be returned or exchanged. Start a request through our Returns page and we’ll guide you through it.',
  },
  {
    q: 'Do you offer gift wrapping and personalised notes?',
    a: 'Yes. Add gift wrapping at checkout and include a short note. We’ll hand-write it and leave the receipt out.',
  },
]

export const FOOTER = [
  { title: 'Shop', links: [
    { label: 'Rings', to: '/shop?category=Rings' },
    { label: 'Necklaces', to: '/shop?category=Necklaces' },
    { label: 'Earrings', to: '/shop?category=Earrings' },
    { label: 'Bracelets', to: '/shop?category=Bracelets' },
  ] },
  { title: 'Company', links: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
  ] },
  { title: 'Support', links: [
    { label: 'FAQ', to: '/#faq' },
    { label: 'Shipping', to: '/contact' },
    { label: 'Returns', to: '/contact' },
    { label: 'Contact', to: '/contact' },
  ] },
  { title: 'Follow', links: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
  ] },
]
