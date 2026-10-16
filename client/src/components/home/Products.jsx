import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiHeart,
  FiTruck,
  FiActivity,
  FiBox,
  FiAward,
} from 'react-icons/fi';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Medical', 'Railway', 'Sports'];

const PRODUCTS = [
  {
    id: 1,
    category: 'Electronics',
    icon: FiZap,
    title: 'Nano Coated Circuit Boards',
    description:
      'Corrosion-resistant nano-coatings extend PCB lifespan by 3x in harsh environments.',
    tag: 'Flagship',
  },
  {
    id: 2,
    category: 'Medical',
    icon: FiHeart,
    title: 'Antimicrobial Medical Devices',
    description:
      'Silver-nano infused coatings deliver 99.9% microbial resistance for surgical tools.',
    tag: 'Certified',
  },
  {
    id: 3,
    category: 'Railway',
    icon: FiTruck,
    title: 'Self-Lubricating Rail Components',
    description:
      'Nano-engineered alloys reduce friction and wear, cutting maintenance downtime by 40%.',
    tag: 'Industrial',
  },
  {
    id: 4,
    category: 'Sports',
    icon: FiActivity,
    title: 'Performance Sports Gear',
    description:
      'Ultra-light nano-composite materials engineered for strength, speed, and durability.',
    tag: 'Premium',
  },
  {
    id: 5,
    category: 'Electronics',
    icon: FiBox,
    title: 'Thermal Nano Pastes',
    description:
      'High-conductivity thermal interface materials for next-gen power electronics.',
    tag: 'New',
  },
  {
    id: 6,
    category: 'Medical',
    icon: FiAward,
    title: 'Drug Delivery Nanoparticles',
    description:
      'Precision nano-carriers for targeted therapeutic delivery with minimal side effects.',
    tag: 'R&D',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="products section" id="products">
      <div className="container">
        {/* Header */}
        <div className="products__header">
          <motion.span
            className="products__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            OUR PRODUCTS
          </motion.span>

          <motion.h2
            className="products__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            One technology platform,{' '}
            <span className="text-gradient">many industries.</span>
          </motion.h2>

          <motion.p
            className="products__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The same core nano-technology is engineered into products across
            these categories — each adapted to its industry's specific
            performance needs.
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div
          className="products__filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`products__filter ${
                activeCategory === cat ? 'products__filter--active' : ''
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="products__grid">
          {filtered.map((product, i) => {
            const Icon = product.icon;
            return (
              <motion.article
                key={product.id}
                className="product-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                layout
              >
                <div className="product-card__glow" />
                <div className="product-card__header">
                  <div className="product-card__icon">
                    <Icon />
                  </div>
                  <span className="product-card__tag">{product.tag}</span>
                </div>
                <h3 className="product-card__title">{product.title}</h3>
                <p className="product-card__desc">{product.description}</p>
                <div className="product-card__footer">
                  <span className="product-card__category">
                    {product.category}
                  </span>
                  <span className="product-card__arrow">→</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}