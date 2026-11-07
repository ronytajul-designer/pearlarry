import { motion } from 'framer-motion'
import { FEATURES_LEFT, FEATURES_RIGHT, IMG } from '../data'
import { ParallaxImg, Reveal, SplitText, ease } from '../components/motion'
import Icon from '../components/Icon'

function FeatureCol({ items, from }) {
  return (
    <div className="feat-col">
      {items.map((f, i) => (
        <motion.div
          key={f.title}
          className="feature"
          initial={{ opacity: 0, x: from * 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease, delay: i * 0.08 }}
        >
          <motion.span
            className="feature-icon"
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 + i * 0.08 }}
          >
            <Icon name={f.icon} size={28} stroke={1.5} />
          </motion.span>
          <h3 className="feature-title">{f.title}</h3>
          <p className="feature-text">{f.text}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default function WhyUs() {
  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="center-head">
          <Reveal as="p" className="eyebrow" y={10}>Why Pearlarry</Reveal>
          <SplitText as="h2" className="h3 why-title" text={['Reasons you’ll wear', 'it every day']} />
        </div>
        <div className="why-body">
          <FeatureCol items={FEATURES_LEFT} from={-1} />
          <ParallaxImg className="why-img" src={IMG.hero} alt="Gold hoops and a fine chain bracelet on ivory silk" speed={16} />
          <FeatureCol items={FEATURES_RIGHT} from={1} />
        </div>
      </div>
    </section>
  )
}
