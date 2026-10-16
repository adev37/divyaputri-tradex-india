import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate(adminOnly ? '/admin-login' : '/auth');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (adminOnly && user.role !== 'admin') {
        // Non-admin can't access
        navigate('/auth');
        return;
      }
    } catch {
      navigate(adminOnly ? '/admin-login' : '/auth');
    }
  }, [navigate, adminOnly]);

  return children;
}