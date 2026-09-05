// features/Logoff.jsx
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Logoff() {
  const { logout } = useAuth();

  async function handleLogout() {
    const result = await logout();

    if (!result.success) {
      console.error(result.error);
    }
  }

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
