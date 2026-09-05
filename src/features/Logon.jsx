// features/Logon.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export default function Logon() {
  const { login } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(emailInput, password);

    if (!result.success) {
      setAuthError(result.error || 'Authentication failed.');
    }

    setIsLoggingOn(false);
  }

  return (
    <div>
      {authError && <div role="alert">{authError}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            required
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            id="email"
          />
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            id="password"
          />
        </div>

        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </div>
  );
}


