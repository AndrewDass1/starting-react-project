import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirecting(true);
      navigate('/login', {
        replace: true,
        state: { from: location },
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated && redirecting) {
    return <p>Redirecting to login...</p>;
  }

  if (!isAuthenticated) return null;

  return children;
}