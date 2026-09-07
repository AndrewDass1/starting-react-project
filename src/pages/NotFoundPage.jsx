import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <p>Try one of these:</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/todos">Todos</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}