import { useState } from 'react';

export default function Logon({onSetEmail, onSetToken}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authError, setAuthError] = useState('');

    const [isLoggingOn, setIsLoggingOn] = useState(false);
    

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        const options = {
            method: 'POST',
            body: JSON.stringify({email}, {password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        };

        try {
            const response = await fetch('/api/users/logon', options);

            const data = await response.json();

            if(response.status === 200 && data.name && data.csrfToken) {
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
            } else {
                setAuthError(`Authentication failed: ${data?.message} || Error occurred`);
            }
        } catch(error) {
            setAuthError(`Error:, ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
        
    };

    return (
    <form onSubmit={handleSubmit}>
      {isLoggingOn && <p>Logging in…</p>}
      {authError && <p className="error">{authError}</p>}

      <div>
        <label>
          Email:
          <input
            type="email"
            value={email} // controlled input
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Password:
          <input
            type="password"
            value={password} // controlled input
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" disabled={isLoggingOn}>
        Log on
      </button>
    </form>
  );
}

