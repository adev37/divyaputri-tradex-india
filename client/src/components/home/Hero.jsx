import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay, FiCheckCircle } from 'react-icons/fi';
import './Hero.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const STATS = [
  { num: '10⁻⁹', label: 'Meter Precision', sub: 'Nano-scale control' },
  { num: '15+', label: 'Product Lines', sub: 'Across 6 industries' },
  { num: '99.8%', label: 'Quality Pass Rate', sub: 'Lab-verified batches' },
];

const TRUST_POINTS = [
  'ISO-certified processes',
  'In-house R&D lab',
  'Pan-India distribution',
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        {/* LEFT */}
        <div className="hero__content">
          <motion.span
            className="hero__badge"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="hero__badge-dot" />
            ADVANCED NANO MATERIALS · MADE IN INDIA
          </motion.span>

          <motion.h1
            className="hero__title"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Nano-engineered solutions for{' '}
            <span className="text-gradient">tomorrow's industries.</span>
          </motion.h1>

          <motion.p
            className="hero__lede"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            From lab-grade nano coatings to precision components — Divyaputri
            Tradex LLP delivers performance materials that power electronics,
            healthcare, railways, and sports equipment across India.
          </motion.p>

          {/* Trust badges */}
          <motion.ul
            className="hero__trust"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="hero__trust-item">
                <FiCheckCircle /> {point}
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="hero__ctas"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <a href="#contact" className="btn btn-primary">
              Request a Quote <FiArrowRight />
            </a>
            <a href="#products" className="btn btn-outline">
              <FiPlay /> Explore Products
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="hero__stats"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            {STATS.map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-num">{s.num}</span>
                <span className="hero__stat-label">{s.label}</span>
                <span className="hero__stat-sub">{s.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero__diagram-wrap">
            <div className="hero__diagram-glow" />
            <svg
              className="hero__diagram"
              viewBox="0 0 420 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="180" cy="170" r="150" className="ring ring-1" />
              <circle cx="180" cy="170" r="115" className="ring ring-2" />
              <circle cx="180" cy="170" r="80" className="ring ring-3" />
              <circle cx="180" cy="170" r="45" className="ring ring-4" />

              <circle cx="180" cy="170" r="6" className="dot-center" />

              <text x="180" y="30" className="label">1 m</text>
              <text x="180" y="65" className="label">1 mm</text>
              <text x="180" y="100" className="label">1 µm</text>
              <text x="180" y="135" className="label">1 nm</text>

              <line x1="180" y1="170" x2="350" y2="80" className="connector" />
              <circle cx="350" cy="80" r="4" className="dot-end" />
              <text x="360" y="84" className="industry">Electronics</text>

              <line x1="180" y1="170" x2="370" y2="170" className="connector" />
              <circle cx="370" cy="170" r="4" className="dot-end" />
              <text x="380" y="174" className="industry">Medical</text>

              <line x1="180" y1="170" x2="350" y2="260" className="connector" />
              <circle cx="350" cy="260" r="4" className="dot-end" />
              <text x="360" y="264" className="industry">Railway</text>

              <line x1="180" y1="170" x2="280" y2="320" className="connector" />
              <circle cx="280" cy="320" r="4" className="dot-end" />
              <text x="290" y="324" className="industry">Sports</text>
            </svg>
          </div>
          <p className="hero__caption">
            One technology platform. Applied across industries.
          </p>
        </motion.div>
      </div>
    </section>
  );
}