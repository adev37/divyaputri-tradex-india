import { motion } from 'framer-motion';
import {
  FiCpu,
  FiShield,
  FiTrendingUp,
  FiLayers,
} from 'react-icons/fi';
import './NanoAdvantage.css';

const ADVANTAGES = [
  {
    icon: FiCpu,
    title: 'Lab-Grade Precision',
    description:
      'Every batch is engineered at 10⁻⁹ meter tolerance, validated by in-house spectroscopy and electron microscopy.',
    metric: '10⁻⁹ m',
    metricLabel: 'Precision level',
  },
  {
    icon: FiShield,
    title: 'Certified Quality',
    description:
      'ISO 9001 & ISO 13485 compliant processes, with full traceability from raw material to finished product.',
    metric: '99.8%',
    metricLabel: 'Quality pass rate',
  },
  {
    icon: FiTrendingUp,
    title: 'Performance Multiplier',
    description:
      'Nano-engineered materials deliver 3–5x improvements in durability, conductivity, and wear resistance.',
    metric: '3–5x',
    metricLabel: 'Performance gain',
  },
  {
    icon: FiLayers,
    title: 'Cross-Industry Platform',
    description:
      'One core nano-tech stack, adapted across electronics, healthcare, railway, and sports applications.',
    metric: '6+',
    metricLabel: 'Industries served',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' },
  }),
};

export default function NanoAdvantage() {
  return (
    <section className="advantage section" id="advantage">
      <div className="advantage__bg">
        <div className="advantage__orb" />
      </div>

      <div className="container advantage__inner">
        {/* Header */}
        <div className="advantage__header">
          <motion.span
            className="advantage__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            THE NANO ADVANTAGE
          </motion.span>

          <motion.h2
            className="advantage__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Why industries choose{' '}
            <span className="text-gradient">our nano technology.</span>
          </motion.h2>

          <motion.p
            className="advantage__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We combine material science, precision engineering, and scalable
            manufacturing to deliver nano-tech that performs — every batch,
            every time.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="advantage__grid">
          {ADVANTAGES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="advantage-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="advantage-card__glow" />

                <div className="advantage-card__icon">
                  <Icon />
                </div>

                <h3 className="advantage-card__title">{item.title}</h3>
                <p className="advantage-card__desc">{item.description}</p>

                <div className="advantage-card__metric">
                  <span className="advantage-card__metric-num">
                    {item.metric}
                  </span>
                  <span className="advantage-card__metric-label">
                    {item.metricLabel}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}