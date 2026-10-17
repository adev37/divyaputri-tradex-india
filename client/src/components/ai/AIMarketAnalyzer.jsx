import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiCpu, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import './AIMarketAnalyzer.css';

const INDUSTRIES = [
  'Electronics',
  'Medical',
  'Railway',
  'Sports',
];

export default function AIMarketAnalyzer() {
  const [industry, setIndustry] = useState('Electronics');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeTrends = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/ai/analyze-trends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setResult(data.analysis);
    } catch (err) {
      console.error(err);
      setError('Could not fetch market trends. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-market">
      <div className="ai-market__header">
        <span className="ai-market__badge">
          <FiTrendingUp /> AI Market Analyzer
        </span>
        <h3>Discover Nano-Tech Opportunities</h3>
        <p>Select an industry to get real-time market trends and strategic insights.</p>
      </div>

      <div className="ai-market__controls">
        <select
          className="ai-market__select"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          disabled={loading}
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary ai-market__btn"
          onClick={analyzeTrends}
          disabled={loading}
        >
          {loading ? (
            <>
              <FiCpu className="spinning" /> Analyzing...
            </>
          ) : (
            <>
              Analyze Trends <FiArrowRight />
            </>
          )}
        </button>
      </div>

      {error && <div className="ai-market__error">{error}</div>}

      <AnimatePresence>
        {result && (
          <motion.div
            className="ai-market__result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="ai-market__result-header">
              <h4>Strategic Report: {industry}</h4>
              <button
                className="ai-market__reset"
                onClick={() => setResult(null)}
                title="Analyze another industry"
              >
                <FiRefreshCw />
              </button>
            </div>
            <div className="ai-market__content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}