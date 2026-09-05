// features/Logon.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export default function Logon() {
  const { setEmail, setToken } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const options = {
      method: 'POST',
      body: JSON.stringify({ email: emailInput, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };

    try {
      const response = await fetch('/api/users/logon', options);
      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
      } else {
        setAuthError(`Authentication failed: ${data?.message}`);
      }
    } catch (error) {
      setAuthError(`${error.name}: ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
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

