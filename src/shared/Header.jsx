// shared/Header.jsx
import { useAuth } from '../features/AuthContext.jsx';

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <div>
      <h1>Todo List</h1>
      {token ? (
        <button type="button" onClick={logout}>
          Logout
        </button>
      ) : null}
    </div>
  );
}

