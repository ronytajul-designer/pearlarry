import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { IMG } from '../images'
import { PageHeader } from '../components/ui'
import { ParallaxImg, Reveal, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'
import { gsap, prefersReducedMotion } from '../lib/smooth'

const STATS = [
  { big: '4', small: 'Collections', count: 4 },
  { big: 'Everyday', small: 'Made to wear' },
  { big: 'Personal', small: 'By design' },
  { big: 'Endless', small: 'Ways to style' },
]

const VALUES = [
  { icon: 'leaf', title: 'Thoughtful design', text: 'Balanced shapes and considered details, designed to feel just as good layered as they do alone.' },
  { icon: 'flask', title: 'Materials & finish', text: 'Explore each piece’s material and finish details to find the right addition to your jewellery box.' },
  { icon: 'world', title: 'Care for your pieces', text: 'Store separately, wipe with a soft cloth, and keep away from perfume and water to protect the finish.' },
]

const MISSION =
  'At Pearlarry, jewellery is a connection — between a moment and a memory, a thoughtful detail and your own sense of style. We explore warm gold tones, sculptural shapes, and delicate textures to create rings, necklaces, earrings, and bracelets you can make your own.'

function Count({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) } })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

export default function About() {
  const mission = useRef(null)

  // Same read-along effect as the homepage story: words light up as you scroll.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.mission-word', { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: '.mission-text', start: 'top 80%', end: 'bottom 50%', scrub: true },
      })
    }, mission)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="About Pearlarry"
        title={['Jewellery for every', 'chapter of your story']}
        lede="We started Pearlarry with one belief: that beautiful jewellery should feel personal, effortless, and part of every day."
      />

      <section className="about-band">
        <ParallaxImg className="about-band-img" src={IMG.hero} alt="Gold hoops, rings and a fine chain on ivory silk" speed={20} eager />
      </section>

      <section className="about-stats tint">
        <div className="container stats">
          {STATS.map((s, i) => (
            <Reveal className="stat" key={s.small} delay={i * 0.08} y={24}>
              <strong>{s.count ? <Count to={s.count} /> : s.big}</strong>
              <span>{s.small}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section mission" id="story" ref={mission}>
        <div className="container center-head">
          <Reveal as="p" className="eyebrow" y={10}>Our story</Reveal>
          <p className="mission-text">
            {MISSION.split(' ').map((w, i) => <span key={i} className="mission-word">{w} </span>)}
          </p>
        </div>
      </section>

      <section className="section values tint">
        <div className="container">
          <div className="center-head">
            <Reveal as="p" className="eyebrow" y={10}>Our values</Reveal>
            <SplitText as="h2" className="h3" text="Our values" />
          </div>
          <div className="value-grid">
            {VALUES.map((v, i) => (
              <motion.article
                key={v.title}
                className="value-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <span className="value-icon"><Icon name={v.icon} size={22} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section founder">
        <div className="container founder-grid">
          <ParallaxImg className="founder-img" src={IMG.flatlay} alt="Pearlarry hoops, rings and pendant on ivory silk" speed={14} />
          <div className="founder-copy">
            <Reveal as="p" className="eyebrow" y={10}>A note from our founder</Reveal>
            <SplitText as="blockquote" className="founder-quote" text="“Pearlarry began with a simple wish — jewellery that feels like you, whatever the occasion.”" stagger={0.03} />
            <Reveal as="p" className="founder-text" delay={0.2} y={16}>
              I have always loved the way a small piece of jewellery can hold a big memory. Pearlarry grew from that feeling: considered shapes, beautiful details, and pieces to mark the little moments as well as the milestones.
            </Reveal>
            <Reveal as="p" className="founder-sign" delay={0.3} y={12}>Maya Laurent · Founder & CEO</Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
