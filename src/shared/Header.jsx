// shared/Header.jsx
import { useAuth } from '../features/AuthContext.jsx';

export default function Header() {
  const { isAuthenticated, email, logout } = useAuth();

  async function handleLogout() {
    const result = await logout();

    // Optional: show an error if logout fails
    if (!result.success) {
      console.error(result.error);
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

