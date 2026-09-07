// Logoff.jsx
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return <button onClick={handleLogout}>Logout</button>;
}
