import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const result = await logout();

    if (result.success) {
      navigate('/login', { replace: true });
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}