const img = (n) => `${import.meta.env.BASE_URL}img/${n}.webp`

export const IMG = {
  hero: img('hero'),
  hoops: img('hoops'),
  bracelet: img('bracelet'),
  pendant: img('pendant'),
  ring: img('ring'),
  neckSingle: img('neck-single'),
  neckLayered: img('neck-layered'),
  handSingle: img('hand-single'),
  handLayered: img('hand-layered'),
}

export const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Our Jewellery', href: '#best-sellers' },
  { label: 'About Us', href: '#our-story' },
  { label: 'Contact', href: '#faq' },
]

export const PRODUCTS = [
  { id: 'hoops', name: 'Signature Hoops', material: '14k Gold Vermeil', rating: '4.9', price: 24, img: IMG.hoops },
  { id: 'bracelet', name: 'Fine Chain Bracelet', material: 'Adjustable', rating: '4.8', price: 22, img: IMG.bracelet },
  { id: 'pendant', name: 'Radiance Pendant', material: '18k Gold Plated', rating: '5.0', price: 38, img: IMG.pendant },
  { id: 'ring', name: 'Everyday Ring', material: 'Sterling Silver', rating: '4.9', price: 28, img: IMG.ring },
]

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

export const CATEGORIES = [
  { name: 'Rings', count: 24, img: IMG.ring, area: 'a' },
  { name: 'Necklaces', count: 15, img: IMG.pendant, area: 'b' },
  { name: 'Earrings', count: 18, img: IMG.hoops, area: 'c' },
  { name: 'Bracelets', count: 9, img: IMG.bracelet, area: 'd' },
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
  { title: 'Shop', links: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] },
  { title: 'Company', links: ['About', 'Our Story', 'Blog', 'Careers'] },
  { title: 'Support', links: ['FAQ', 'Shipping', 'Returns', 'Contact'] },
  { title: 'Follow', links: ['Instagram', 'TikTok', 'YouTube', 'Pinterest'] },
]
