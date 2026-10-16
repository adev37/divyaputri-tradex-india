import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiMail,
  FiMessageCircle,
  FiLogOut,
  FiRefreshCw,
  FiInbox,
  FiExternalLink,
} from 'react-icons/fi';
import './AdminPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers }),
      ]);

      if (statsRes.status === 401 || contactsRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return;
      }

      const statsData = await statsRes.json();
      const contactsData = await contactsRes.json();

      setStats(statsData);
      setContacts(contactsData.contacts || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page__loader">
          <div className="admin-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: FiMail,
      label: 'Contact Submissions',
      value: stats?.contacts || 0,
      color: 'blue',
    },
    {
      icon: FiUsers,
      label: 'Registered Users',
      value: stats?.users || 0,
      color: 'green',
    },
    {
      icon: FiMessageCircle,
      label: 'AI Chat Messages',
      value: stats?.chats || 0,
      color: 'amber',
    },
  ];

  return (
    <div className="admin-page">
      {/* Background subtle grid */}
      <div className="admin-page__bg" />

      <div className="container admin-page__inner">
        {/* Header */}
        <motion.header
          className="admin-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-header__left">
            <h1>
              Welcome back, <span>{user?.name || 'Admin'}</span>
            </h1>
            <p>Here's what's happening with Divyaputri Tradex today.</p>
          </div>

          <div className="admin-header__actions">
            <button className="admin-btn admin-btn--ghost" onClick={fetchData}>
              <FiRefreshCw /> Refresh
            </button>
            <button
              className="admin-btn admin-btn--solid"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </motion.header>

        {error && (
          <div className="admin-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="admin-stats">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`admin-stat admin-stat--${stat.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="admin-stat__bar" />
                <div className="admin-stat__icon">
                  <Icon />
                </div>
                <div className="admin-stat__body">
                  <span className="admin-stat__num">
                    {stat.value.toLocaleString('en-IN')}
                  </span>
                  <span className="admin-stat__label">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contacts Table */}
        <motion.section
          className="admin-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="admin-section__header">
            <div>
              <h2>Recent Contact Submissions</h2>
              <p>Latest messages from potential clients</p>
            </div>
            <span className="admin-section__badge">
              {contacts.length} total
            </span>
          </div>

          {contacts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">
                <FiInbox />
              </div>
              <h3>No submissions yet</h3>
              <p>
                When someone submits the contact form, their message will
                appear here.
              </p>
              <a href="/" className="admin-empty__link">
                View website <FiExternalLink />
              </a>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <span className="admin-table__name">{c.name}</span>
                      </td>
                      <td>
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </td>
                      <td>{c.phone || '—'}</td>
                      <td className="admin-table__msg">{c.message}</td>
                      <td className="admin-table__date">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}