import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiX,
  FiHome,
  FiUser,
  FiBox,
  FiZap,
  FiMail,
} from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const NAV_LINKS = [
  { name: 'Home', href: '#home', icon: FiHome },
  { name: 'About', href: '#about', icon: FiUser },
  { name: 'Products', href: '#products', icon: FiBox },
  { name: 'Advantage', href: '#advantage', icon: FiZap },
  { name: 'Contact', href: '#contact', icon: FiMail },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        const offset = 72;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar__logo" onClick={() => setIsOpen(false)}>
            <span className="navbar__logo-mark">DT</span>
            <span className="navbar__logo-text">
              Divyaputri <span>Tradex</span>
            </span>
          </Link>

          <nav className="navbar__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''
                  }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="navbar__actions">
            <ThemeToggle />

            <Link to="/auth" className="btn btn-primary navbar__cta">
              Get Started <FiArrowRight />
            </Link>

            <button
              className={`nav-menu-btn ${isOpen ? 'is-open' : ''}`}
              onClick={() => setIsOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className="nav-menu-btn__line nav-menu-btn__line--1" />
              <span className="nav-menu-btn__line nav-menu-btn__line--2" />
              <span className="nav-menu-btn__line nav-menu-btn__line--3" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="nav-drawer__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className="nav-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header with close button */}
              <div className="nav-drawer__header">
                <button
                  className="nav-drawer__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              {/* Links */}
              <nav className="nav-drawer__links">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="nav-drawer__link"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    >
                      <span className="nav-drawer__link-icon">
                        <Icon />
                      </span>
                      <span className="nav-drawer__link-text">{link.name}</span>
                      <FiArrowRight className="nav-drawer__link-arrow" />
                    </motion.a>
                  );
                })}
              </nav>

              {/* Footer */}
              <motion.div
                className="nav-drawer__footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/auth"
                  className="nav-drawer__cta"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started <FiArrowRight />
                </Link>
                <p className="nav-drawer__hint">
                  Nano-engineered solutions · Made in India
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;