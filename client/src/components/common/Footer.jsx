import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiArrowUpRight,
  FiBriefcase,
} from 'react-icons/fi';
import './Footer.css';

const QUICK_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Products', href: '#products' },
  { name: 'Advantage', href: '#advantage' },
  { name: 'Contact', href: '#contact' },
];

const PRODUCTS = [
  { name: 'Electronics', href: '#products' },
  { name: 'Medical', href: '#products' },
  { name: 'Railway', href: '#products' },
  { name: 'Sports', href: '#products' },
  { name: 'Custom Solutions', href: '#contact' },
];

const SOCIALS = [
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiFacebook, href: '#', label: 'Facebook' },
  { icon: FiInstagram, href: '#', label: 'Instagram' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__accent" />

      <div className="container footer__inner">
        {/* TOP GRID */}
        <div className="footer__grid">
          {/* COL 1 — Brand */}
          <motion.div
            className="footer__col footer__col--brand"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <a href="#home" className="footer__logo">
              <span className="footer__logo-mark">DT</span>
              <span className="footer__logo-text">
                Divyaputri <span>Tradex</span>
              </span>
            </a>
            <p className="footer__tagline">
              Engineering nano-materials that power tomorrow's industries.
              Made in India, built for the world.
            </p>

            <div className="footer__socials">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="footer__social"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* COL 2 — Quick Links */}
          <motion.div
            className="footer__col"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer__link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COL 3 — Products */}
          <motion.div
            className="footer__col"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <h4 className="footer__heading">Products</h4>
            <ul className="footer__links">
              {PRODUCTS.map((p) => (
                <li key={p.name}>
                  <a href={p.href} className="footer__link">
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COL 4 — Contact */}
          <motion.div
            className="footer__col"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <h4 className="footer__heading">Get in touch</h4>
            <ul className="footer__contact">
              <li>
                <FiMail />
                <a href="mailto:info@divyaputritradex.com">
                  divyaputritradex@gmail.com
                </a>
              </li>
              <li>
                <FiBriefcase /> {/* ← Phone ki jagah Briefcase icon */}
                <span>Divyaputri Tradex LLP</span> {/* ← Company Name */}
              </li>
              <li>
                <FiMapPin />
                <span>New Delhi, Delhi, India</span>
              </li>
            </ul>

            <a href="#contact" className="footer__cta">
              Request a Quote <FiArrowUpRight />
            </a>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Divyaputri Tradex LLP. All rights reserved.
          </p>
          <ul className="footer__legal">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}