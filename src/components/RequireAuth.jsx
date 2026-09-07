import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) return null;

  return children;
}