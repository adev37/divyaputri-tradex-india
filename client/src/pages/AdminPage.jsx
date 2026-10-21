import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiMail,
  FiMessageCircle,
  FiRefreshCw,
  FiInbox,
  FiExternalLink,
  FiCpu,
  FiTrendingUp,
  FiX, // ✅ Naya icon import kiya
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown'; // ✅ Error fix
import './AdminPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI Insights State
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  // Competitor Analysis State
  const [competitorInsight, setCompetitorInsight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

    // ✅ Naye States (Purane state waise hi rahenge)
  const [tableType, setTableType] = useState('contacts'); 
  const [tableData, setTableData] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin-login';
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  // ✅ Naya fetchData (Card Click handle karega)
  const fetchData = async (type = 'contacts') => {
    setLoading(true);
    setError('');
    setTableType(type);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, dataRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/${type}`, { headers }),
      ]);

      if (statsRes.status === 401 || dataRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return;
      }

      const statsData = await statsRes.json();
      const data = await dataRes.json();

      setStats(statsData);
      // API se jo bhi aaye (contacts, users, ya chats), usko set karo
      setTableData(data[type] || []); 
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // ✅ AI Insight Generator
  const handleGenerateInsight = async () => {
    setInsightLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/ai-insights`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInsightLoading(false);
    }
  };

  // ✅ Competitor Analysis Generator
  const handleAnalyzeCompetitors = async () => {
    setIsAnalyzing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/competitor-analysis`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCompetitorInsight(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
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
    { icon: FiMail, label: 'Contact Submissions', value: stats?.contacts || 0, color: 'blue', type: 'contacts' }, // ✅ type add kiya
    { icon: FiUsers, label: 'Registered Users', value: stats?.users || 0, color: 'green', type: 'users' }, // ✅ type add kiya
    { icon: FiMessageCircle, label: 'AI Chat Messages', value: stats?.chats || 0, color: 'amber', type: 'chats' }, // ✅ type add kiya
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__bg" />

      <div className="container admin-page__inner">
        <motion.header className="admin-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-header__left">
            <h1>Welcome back, <span>{user?.name || 'Admin'}</span></h1>
            <p>Here's what's happening with Divyaputri Tradex today.</p>
          </div>
          <div className="admin-header__actions">
            <button className="admin-btn admin-btn--ghost" onClick={fetchData}>
              <FiRefreshCw /> Refresh Data
            </button>
          </div>
        </motion.header>

        {error && <div className="admin-error"><span>⚠️</span> {error}</div>}

        {/* ✅ AI INSIGHTS CARD */}
        <motion.div className="admin-ai-insight">
          <div className="admin-ai-insight__icon"><FiCpu /></div>
          <div className="admin-ai-insight__content" style={{ flex: 1 }}>
            <h3>AI Business Insight</h3>
            {insightLoading ? (
              <p className="admin-ai-insight__loading">Analyzing your data...</p>
            ) : aiInsight ? (
              <>
                <p>{aiInsight}</p>
                <button className="admin-btn admin-btn--ghost" onClick={() => setAiInsight('')} style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px' }}>
                  <FiX /> Close
                </button>
              </>
            ) : (
              <button className="admin-btn admin-btn--solid" onClick={handleGenerateInsight} style={{ marginTop: '8px' }}>
                Generate Insights
              </button>
            )}
          </div>
        </motion.div>

        {/* ✅ COMPETITOR ANALYSIS CARD */}
        <motion.div className="admin-ai-insight" style={{ borderColor: 'var(--color-accent)' }}>
          <div className="admin-ai-insight__icon" style={{ background: 'var(--gradient-accent)' }}><FiTrendingUp /></div>
          <div className="admin-ai-insight__content" style={{ flex: 1 }}>
            <h3>AI Competitor Analysis</h3>
            {isAnalyzing ? (
              <p className="admin-ai-insight__loading">Scanning market...</p>
            ) : competitorInsight ? (
              <>
                <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6 }}>
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p style={{ margin: '0 0 12px 0', lineHeight: '1.6', color: 'var(--text-secondary)' }} {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong style={{ color: 'var(--text-primary)', display: 'inline-block', marginTop: '8px' }} {...props} />
                      ),
                      h1: ({ node, ...props }) => <h1 style={{ fontSize: 'var(--fs-lg)', margin: '16px 0 8px 0', color: 'var(--color-primary)' }} {...props} />,
                      h2: ({ node, ...props }) => <h2 style={{ fontSize: 'var(--fs-base)', margin: '16px 0 8px 0', color: 'var(--color-primary)' }} {...props} />,
                      h3: ({ node, ...props }) => <h3 style={{ fontSize: 'var(--fs-sm)', margin: '16px 0 8px 0', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }} {...props} />,
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: '6px', marginLeft: '16px', listStyleType: 'disc', color: 'var(--text-secondary)' }} {...props} />
                      )
                    }}
                  >
                    {competitorInsight}
                  </ReactMarkdown>
                </div>
                <button className="admin-btn admin-btn--ghost" onClick={() => setCompetitorInsight('')} style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px' }}>
                  <FiX /> Close Analysis
                </button>
              </>
            ) : (
              <button className="admin-btn admin-btn--solid" onClick={handleAnalyzeCompetitors} style={{ marginTop: '8px', background: 'var(--gradient-accent)', color: '#0F172A' }}>
                Analyze Market Competitors
              </button>
            )}
          </div>
        </motion.div>

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
                transition={{ delay: 0.2 + i * 0.1 }}
                // ✅ Ye 2 lines add karo click ke liye
                onClick={() => fetchData(stat.type)}
                style={{ cursor: 'pointer', border: tableType === stat.type ? '1px solid var(--color-primary)' : '1px solid var(--border-color)' }}
              >
                <div className="admin-stat__bar" />
                <div className="admin-stat__icon"><Icon /></div>
                <div className="admin-stat__body">
                  <span className="admin-stat__num">{stat.value.toLocaleString('en-IN')}</span>
                  <span className="admin-stat__label">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contacts Table */}
        <motion.section className="admin-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="admin-section__header">
            <div>
              <h2>
                {tableType === 'contacts' && 'Recent Contact Submissions'}
                {tableType === 'users' && 'Registered Users'}
                {tableType === 'chats' && 'AI Chat Messages'}
              </h2>
              <p>Latest data from potential clients</p>
            </div>
            <span className="admin-section__badge">{tableData.length} total</span>
          </div>

          {tableData.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon"><FiInbox /></div>
              <h3>No data found</h3>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  {tableType === 'contacts' && <tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th></tr>}
                  {tableType === 'users' && <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>}
                  {tableType === 'chats' && <tr><th>User Msg</th><th>AI Reply</th><th>Date</th></tr>}
                </thead>
                <tbody>
                  {/* Contacts Table */}
                  {tableType === 'contacts' && tableData.map((c) => (
                    <tr key={c._id} onClick={() => setSelectedContact(c)} style={{ cursor: 'pointer' }}>
                      <td><span className="admin-table__name">{c.name}</span></td>
                      <td>{c.email}</td>
                      <td>{c.phone || '—'}</td>
                      <td className="admin-table__msg">{c.message}</td>
                      <td className="admin-table__date">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  
                  {/* Users Table */}
                  {tableType === 'users' && tableData.map((u) => (
                    <tr key={u._id}>
                      <td><span className="admin-table__name">{u.name}</span></td>
                      <td>{u.email}</td>
                      <td><span className={`admin-badge ${u.role === 'admin' ? 'admin-badge--admin' : ''}`}>{u.role}</span></td>
                      <td className="admin-table__date">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {/* Chats Table */}
                  {tableType === 'chats' && tableData.map((chat) => (
                    <tr key={chat._id}>
                      <td className="admin-table__msg">{chat.userMessage}</td>
                      <td className="admin-table__msg" style={{ color: 'var(--color-primary)' }}>{chat.aiReply}</td>
                      <td className="admin-table__date">{new Date(chat.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
                    {/* ✅ Message Modal */}
      {selectedContact && (
        <div className="admin-modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>Message from {selectedContact.name}</h3>
              <button className="admin-modal__close" onClick={() => setSelectedContact(null)}><FiX /></button>
            </div>
            <div className="admin-modal__body">
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Phone:</strong> {selectedContact.phone || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>
              <hr style={{ margin: '16px 0', borderColor: 'var(--border-color)' }} />
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '15px' }}>
                {selectedContact.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}