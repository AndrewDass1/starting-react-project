// shared/Header.jsx
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <button type="button" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

