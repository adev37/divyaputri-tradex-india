import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiShield } from 'react-icons/fi';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Save token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
      }

      setStatus('success');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-page__inner">
        {/* LEFT — Brand side */}
        <motion.div
          className="auth-page__brand"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-page__brand-logo">
            <span>DT</span>
          </div>
          <h1 className="auth-page__brand-title">
            Divyaputri <span>Tradex</span>
          </h1>
          <p className="auth-page__brand-text">
            Secure access to your nano-tech dashboard. Manage products,
            submissions, and business insights — all in one place.
          </p>

          <ul className="auth-page__features">
            <li>
              <FiShield /> Bank-grade security
            </li>
            <li>
              <FiShield /> Real-time analytics
            </li>
            <li>
              <FiShield /> Product catalog control
            </li>
          </ul>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.div
          className="auth-page__form-wrap"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-card">
            {/* Tabs */}
            <div className="auth-card__tabs">
              <button
                className={`auth-card__tab ${mode === 'signin' ? 'is-active' : ''}`}
                onClick={() => setMode('signin')}
              >
                Sign In
              </button>
              <button
                className={`auth-card__tab ${mode === 'signup' ? 'is-active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <div className="auth-card__header">
              <h2>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
              <p>
                {mode === 'signin'
                  ? 'Sign in to continue to your dashboard.'
                  : 'Sign up to get started with Divyaputri Tradex.'}
              </p>
            </div>

            <form className="auth-card__form" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="auth-field">
                  <label htmlFor="name">Full name</label>
                  <div className="auth-field__input">
                    <FiUser />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <div className="auth-field__input">
                  <FiMail />
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

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-field__input">
                  <FiLock />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder={
                      mode === 'signup' ? 'Minimum 8 characters' : 'Your password'
                    }
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-card__submit"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? 'Please wait...'
                  : status === 'success'
                  ? '✅ Success!'
                  : status === 'error'
                  ? '❌ Try again'
                  : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
                {status === 'idle' && <FiArrowRight />}
              </button>

              {status === 'error' && (
                <p className="auth-card__error">
                  Authentication failed. Please check your credentials.
                </p>
              )}
            </form>

            <div className="auth-card__footer">
              <a href="#admin">Admin sign in →</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}