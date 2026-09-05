// contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  async function login(userEmail, password) {
    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.csrfToken) {
        return {
          success: false,
          error: data.message || 'Authentication failed.',
        };
      }

      setEmail(data.name);
      setToken(data.csrfToken);

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Network error during login.',
      };
    }
  }

  async function logout() {
    try {
      const response = await fetch('/api/users/logoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      setEmail('');
      setToken('');

      if (!response.ok) {
        return {
          success: false,
          error: 'Logout request failed, but session was cleared.',
        };
      }

      return { success: true };
    } catch {
      setEmail('');
      setToken('');
      return {
        success: false,
        error: 'Network error during logout.',
      };
    }
  }

  const value = {
    email,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}



