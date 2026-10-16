import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiX,
  FiHome,
  FiUser,
  FiBox,
  FiZap,
  FiMail,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiUserPlus,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname === '/admin';

  // Listen to auth changes
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener('userAuthChanged', loadUser);
    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('userAuthChanged', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, [location.pathname, location.hash]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section
  useEffect(() => {
    if (location.pathname !== '/') return;
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
  }, [location.pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        const offset = 72;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('userAuthChanged'));
    navigate('/auth');
  };

  /* ===== ADMIN NAVBAR ===== */
  if (isAdminPage) {
    return (
      <header
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''} navbar--admin`}
      >
        <div className="container navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">DT</span>
            <span className="navbar__logo-text">
              Divyaputri <span>Tradex</span>
            </span>
          </Link>

          <div className="navbar__admin-badge">
            <FiGrid />
            <span>Admin Dashboard</span>
          </div>

          <div className="navbar__actions">
            <ThemeToggle />
            <button
              className="btn btn-outline navbar__admin-logout"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>
    );
  }

  /* ===== NORMAL NAVBAR ===== */
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
                className={`navbar__link ${
                  activeSection === link.href.slice(1) ? 'navbar__link--active' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="navbar__actions">
            <ThemeToggle />

            {/* If logged in → User Menu | Else → Sign In */}
            {user ? (
              <div
                className="navbar__user"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={`navbar__user-btn ${
                    userMenuOpen ? 'is-open' : ''
                  }`}
                  onClick={() => setUserMenuOpen((p) => !p)}
                  aria-label="User menu"
                >
                  <span className="navbar__user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="navbar__user-name">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                  <FiChevronDown
                    className={`navbar__user-chevron ${
                      userMenuOpen ? 'is-open' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="navbar__user-menu"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* User info header */}
                      <div className="navbar__user-menu-header">
                        <span className="navbar__user-menu-avatar">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <div className="navbar__user-menu-info">
                          <span className="navbar__user-menu-name">
                            {user.name || 'User'}
                          </span>
                          <span className="navbar__user-menu-email">
                            {user.email || ''}
                          </span>
                        </div>
                      </div>

                      {/* Admin link — only for admins */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="navbar__user-menu-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiGrid /> Admin Dashboard
                        </Link>
                      )}

                      {/* Divider */}
                      <div className="navbar__user-menu-divider" />

                      {/* Logout */}
                      <button
                        className="navbar__user-menu-item navbar__user-menu-item--danger"
                        onClick={handleLogout}
                      >
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary navbar__cta">
                <FiUserPlus /> Sign In
              </Link>
            )}

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

      {/* Mobile Drawer */}
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
              <div className="nav-drawer__header">
                <button
                  className="nav-drawer__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              {/* User info at top (if logged in) */}
              {user && (
                <div className="nav-drawer__user">
                  <span className="nav-drawer__user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <div className="nav-drawer__user-info">
                    <span className="nav-drawer__user-name">
                      {user.name || 'User'}
                    </span>
                    <span className="nav-drawer__user-email">
                      {user.email || ''}
                    </span>
                  </div>
                </div>
              )}

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

              <motion.div
                className="nav-drawer__footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="nav-drawer__cta"
                        onClick={() => setIsOpen(false)}
                        style={{ marginBottom: '8px' }}
                      >
                        <FiGrid /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="nav-drawer__cta nav-drawer__cta--danger"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      style={{ border: 'none', cursor: 'pointer', width: '100%' }}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="nav-drawer__cta"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In <FiArrowRight />
                  </Link>
                )}
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