import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function navLinkStyle({ isActive }) {
  return {
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
    margin: '0 1rem',
  };
}

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <li>
          <NavLink to="/" style={navLinkStyle} end>
            HOME
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" style={navLinkStyle}>
            ABOUT
          </NavLink>
        </li>

        {!isAuthenticated && (
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              LOGIN
            </NavLink>
          </li>
        )}

        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>
                TODOS
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>
                PROFILE
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}