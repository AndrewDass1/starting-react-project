import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/about">
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/todos">
            Todos
          </NavLink>
        </li>

        {isAuthenticated && (
          <li>
            <NavLink to="/profile">
              Profile
            </NavLink>
          </li>
        )}

        {!isAuthenticated ? (
          <li>
            <NavLink to="/login">
              Login
            </NavLink>
          </li>
        ) : (
          <li>
            <Logoff />
          </li>
        )}
      </ul>
    </nav>
  );
}