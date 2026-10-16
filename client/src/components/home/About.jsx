import { motion } from 'framer-motion';
import {
  FiTarget,
  FiAward,
  FiUsers,
  FiGlobe,
  FiArrowRight,
} from 'react-icons/fi';
import './About.css';

const HIGHLIGHTS = [
  {
    icon: FiTarget,
    title: 'Precision First',
    description:
      'Every batch engineered at 10⁻⁹ meter tolerance with lab-grade validation.',
  },
  {
    icon: FiAward,
    title: 'ISO Certified',
    description:
      'ISO 9001 & 13485 compliant processes with full material traceability.',
  },
  {
    icon: FiUsers,
    title: 'Expert Team',
    description:
      'Material scientists and industry specialists working on cutting-edge nano-tech.',
  },
  {
    icon: FiGlobe,
    title: 'Pan-India Reach',
    description: 'Distribution across India with growing global partnerships.',
  },
];

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="about__bg-orb" />

      <div className="container about__inner">
        {/* LEFT — Content */}
        <motion.div
          className="about__content"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <span className="about__eyebrow">ABOUT US</span>

          <h2 className="about__title">
            Engineering tomorrow's materials,{' '}
            <span className="text-gradient">today.</span>
          </h2>

          <p className="about__lede">
            Divyaputri Tradex LLP builds performance nano-materials for the
            industries that power modern India.
          </p>

          <div className="about__text-group">
            <p className="about__text">
              Founded to bridge the gap between cutting-edge research and
              real-world manufacturing, we develop, test, and scale
              nano-engineered solutions across electronics, healthcare,
              railways, and sports.
            </p>

            <p className="about__text">
              Our in-house R&D lab, precision manufacturing, and rigorous
              quality control ensure every product performs exactly as
              promised — at 10⁻⁹ meter accuracy.
            </p>
          </div>

          <div className="about__ctas">
            <a href="#contact" className="btn btn-primary">
              Partner with us <FiArrowRight />
            </a>
            <a href="#products" className="btn btn-outline">
              See our work
            </a>
          </div>
        </motion.div>

        {/* RIGHT — Highlights Grid */}
        <div className="about__highlights">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="about-highlight"
                custom={i}
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="about-highlight__icon">
                  <Icon />
                </div>
                <div className="about-highlight__body">
                  <h3 className="about-highlight__title">{item.title}</h3>
                  <p className="about-highlight__desc">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}