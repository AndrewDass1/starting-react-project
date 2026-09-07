import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Log In</button>
      </form>
    </div>
  );
}