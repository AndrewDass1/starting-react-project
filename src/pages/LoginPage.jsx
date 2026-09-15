import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import button from '../button.module.css';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  function isFormValid() {
    if (!email.trim() || !password.trim()) {
      setValidationError('Email and password are required.');
      return false;
    }

    if (email.length > 100) {
      setValidationError('Email must be 100 characters or fewer.');
      return false;
    }

    if (password.length > 50) {
      setValidationError('Password must be 50 characters or fewer.');
      return false;
    }

    setValidationError('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isFormValid()) return;

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  }

  const isDisabled = !email.trim() || !password.trim();

  return (
    <div>
      <h2>LOGIN</h2>

      {validationError && (
        <p style={{ color: 'red' }}>{validationError}</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>EMAIL: </label> <br />
          <input
            type="email"
            value={email}
            maxLength={100}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>PASSWORD: </label> <br />
          <input
            type="password"
            value={password}
            maxLength={50}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button
          type="submit"
          className={button.button}
          disabled={isDisabled}
        >
          LOG IN
        </button>
      </form>
    </div>
  );
}