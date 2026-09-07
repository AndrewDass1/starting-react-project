import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/todos', { replace: true });
  } else {
    navigate('/login', { replace: true });
  }

  return null;
}