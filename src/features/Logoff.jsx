import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    setLoading(true);
    setError('');

    const result = await logout();

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Logout failed');
      return;
    }

    navigate('/login', { replace: true });
  }

  return (
    <div>
      <br></br>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'LOGGING OUT...' : 'LOGOUT'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}