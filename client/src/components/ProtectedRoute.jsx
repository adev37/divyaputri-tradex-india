import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // 1. Agar login nahi hai -> /auth bhejo
    if (!token || !userStr) {
      navigate('/auth');
      return;
    }

    // 2. Agar Admin route hai par user Admin nahi hai -> /auth bhejo
    try {
      const user = JSON.parse(userStr);
      if (adminOnly && user.role !== 'admin') {
        navigate('/auth');
      }
    } catch {
      navigate('/auth');
    }
  }, [navigate, adminOnly]);

  return children;
}