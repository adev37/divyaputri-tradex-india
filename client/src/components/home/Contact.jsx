import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiBriefcase,
} from 'react-icons/fi';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './Contact.css';

const COUNTRY_LIMITS = {
  IN: 10, US: 10, GB: 10, CA: 10, AU: 9, DE: 11, FR: 9, JP: 10, CN: 11,
  AE: 9, SA: 9, SG: 8, NP: 10, BD: 10, LK: 9, PK: 10, MY: 9, ID: 11,
  TH: 9, PH: 10, VN: 9, KR: 10, IT: 10, ES: 9, RU: 10, BR: 11, MX: 10,
  ZA: 9, NG: 10, KE: 9, EG: 10, TR: 10, IR: 10, IQ: 10, IL: 9, NZ: 9,
  IE: 9, NL: 9, BE: 9, CH: 9, AT: 10, SE: 9, NO: 8, DK: 8, FI: 9, PL: 9,
  PT: 9, GR: 10, CZ: 9, HU: 9, RO: 9, UA: 9, AR: 10, CL: 9, CO: 10,
  PE: 9, VE: 10, EC: 9, UY: 8, PY: 9, BO: 8, CR: 8, PA: 8, DO: 10,
  GT: 8, SV: 8, HN: 8, NI: 8, CU: 8, JM: 10, TT: 10, BH: 8, KW: 8,
  QA: 8, OM: 8, JO: 9, LB: 8, SY: 9, YE: 9, AF: 9, MM: 9, KH: 9,
  LA: 9, MN: 8, TW: 9, HK: 8, MO: 8,
};

const DEFAULT_LIMIT = 15;

const CONTACT_INFO = [
  {
    icon: FiMail,
    label: 'Email Us',
    value: 'info@divyaputritradex.com',
    href: 'mailto:info@divyaputritradex.com',
  },
  {
    icon: FiBriefcase,
    label: 'Company',
    value: 'Divyaputri Tradex LLP',
    href: '#',
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
  const [country, setCountry] = useState('IN');
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMaxDigits = (countryCode) => {
    return COUNTRY_LIMITS[countryCode] || DEFAULT_LIMIT;
  };

  // Total allowed digits (country code + local)
  const getTotalAllowed = (countryCode) => {
    const callingCode = getCountryCallingCode(countryCode);
    return callingCode.length + getMaxDigits(countryCode);
  };

  // Block keydown if already at limit
  const handleKeyDown = (e) => {
    const allowed = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
      'Enter',
    ];

    // Non-digit keys block karo (allow backspace, arrows, etc.)
    if (!/^\d$/.test(e.key) && !allowed.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return;
    }

    // Agar digit hai aur limit reach ho chuki hai to block
    if (/^\d$/.test(e.key)) {
      const currentDigits = (formData.phone || '').replace(/\D/g, '');
      const totalAllowed = getTotalAllowed(country);
      if (currentDigits.length >= totalAllowed) {
        e.preventDefault();
      }
    }
  };

  const handlePhoneChange = (value) => {
    if (!value) {
      setFormData({ ...formData, phone: '' });
      return;
    }

    const digitsOnly = value.replace(/\D/g, '');
    const totalAllowed = getTotalAllowed(country);

    if (digitsOnly.length > totalAllowed) {
      return; // Ignore
    }

    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    if (formData.phone) {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      const callingCode = getCountryCallingCode(country);
      const localDigits = digitsOnly.slice(callingCode.length);
      const maxDigits = getMaxDigits(country);

      if (localDigits.length !== maxDigits) {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
        return;
      }
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error('Network error');

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setCountry('IN');
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

        <div className="contact__grid">
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
                    maxLength={100}
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

              {/* Phone */}
              <div className="contact-form__field">
                <label htmlFor="phone">Phone (optional)</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  countryCallingCodeEditable={false}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onCountryChange={(newCountry) => setCountry(newCountry || 'IN')}
                  onKeyDown={handleKeyDown}
                  className="contact-phone-input"
                />
                <span className="contact-form__hint">
                  Max {getMaxDigits(country)} digits for this country
                </span>
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
                  maxLength={2000}
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
                  'Invalid phone number'
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
                  ❌ Please enter a valid phone number for the selected country.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}