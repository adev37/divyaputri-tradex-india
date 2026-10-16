import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="theme-toggle__thumb"
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <FiMoon size={14} /> : <FiSun size={14} />}
      </motion.div>
      <span className="theme-toggle__icon theme-toggle__icon--left">
        <FiSun size={14} />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--right">
        <FiMoon size={14} />
      </span>
    </button>
  );
};

export default ThemeToggle;