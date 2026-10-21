import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from 'react-icons/fi';
import './AuthPage.css';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Check if user is admin
      if (data.user?.role !== 'admin') {
        throw new Error('Access denied. Admin credentials required.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navbar ko update karne ke liye event
      window.dispatchEvent(new Event('userAuthChanged'));

      setStatus('success');
      // Redirect to Admin Dashboard
      setTimeout(() => {
        window.location.href = '/admin'; 
      }, 600);
    } catch (err) {
      setError(err.message);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
      </div>

      <div className="auth-page__inner">
        {/* LEFT — Brand */}
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
            Admin <span>Access</span>
          </h1>
          <p className="auth-page__brand-text">
            Restricted area. Only authorized administrators can access the
            dashboard.
          </p>

          <ul className="auth-page__features">
            <li>
              <FiShield /> Admin-only access
            </li>
            <li>
              <FiShield /> Encrypted credentials
            </li>
            <li>
              <FiShield /> Secure session
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
            <Link to="/auth" className="auth-card__back">
              <FiArrowLeft /> Back to user sign in
            </Link>

            <div className="auth-card__header">
              <h2>Admin Sign In</h2>
              <p>Enter your administrator credentials to continue.</p>
            </div>

            <form className="auth-card__form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Admin email</label>
                <div className="auth-field__input">
                  <FiMail />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@company.com"
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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="auth-field__toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
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
                  ? '❌ Failed'
                  : 'Sign In as Admin'}
                {status === 'idle' && <FiArrowRight />}
              </button>

              {status === 'error' && (
                <p className="auth-card__error">{error}</p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}