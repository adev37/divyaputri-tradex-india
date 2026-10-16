import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';
import './Contact.css';

const CONTACT_INFO = [
  {
    icon: FiMail,
    label: 'Email Us',
    value: 'info@divyaputritradex.com',
    href: 'mailto:info@divyaputritradex.com',
  },
  {
    icon: FiPhone,
    label: 'Call Us',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: FiMapPin,
    label: 'Visit Us',
    value: 'Mumbai, Maharashtra, India',
    href: '#',
  },
  {
    icon: FiClock,
    label: 'Working Hours',
    value: 'Mon–Sat · 9:00 AM – 7:00 PM',
    href: '#',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' },
  }),
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Network error');

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        {/* Header */}
        <div className="contact__header">
          <motion.span
            className="contact__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            GET IN TOUCH
          </motion.span>

          <motion.h2
            className="contact__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Let's build something{' '}
            <span className="text-gradient">remarkable.</span>
          </motion.h2>

          <motion.p
            className="contact__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a project in mind? Looking for nano-tech solutions? Reach
            out — our team will get back within 24 hours.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="contact__grid">
          {/* LEFT — Info */}
          <motion.div
            className="contact__info"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          >
            <h3 className="contact__info-heading">
              We'd love to hear from you.
            </h3>
            <p className="contact__info-text">
              Whether you need a quote, a custom nano-material solution, or
              just want to learn more about what we do — we're here.
            </p>

            <div className="contact__info-list">
              {CONTACT_INFO.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="contact-info-card"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i + 1}
                  >
                    <div className="contact-info-card__icon">
                      <Icon />
                    </div>
                    <div className="contact-info-card__content">
                      <span className="contact-info-card__label">
                        {item.label}
                      </span>
                      <span className="contact-info-card__value">
                        {item.value}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            className="contact__form-wrap"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={1}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-form__field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form__field">
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-form__submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  'Sending...'
                ) : status === 'success' ? (
                  <>
                    <FiCheckCircle /> Message sent!
                  </>
                ) : status === 'error' ? (
                  'Failed — try again'
                ) : (
                  <>
                    Send message <FiSend />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="contact-form__message contact-form__message--success">
                  ✅ Thanks! We'll get back to you within 24 hours.
                </p>
              )}
              {status === 'error' && (
                <p className="contact-form__message contact-form__message--error">
                  ❌ Something went wrong. Please try again.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}