import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import '.././navigation.css';

function navLinkStyle({ isActive }) {
  return {
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
    margin: '1rem',
  };
}

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul style={{ listStyle: 'none',  padding: 0, margin: 0 }}>
        <li>
          <NavLink to="/" style={navLinkStyle} end>
            HOME
          </NavLink>

          <NavLink to="/about" style={navLinkStyle}>
            ABOUT
          </NavLink>

          {!isAuthenticated && (
          
          <NavLink to="/login" style={navLinkStyle}>
            LOGIN
          </NavLink>
        )}

          {isAuthenticated && (
          <>
              <NavLink to="/todos" style={navLinkStyle}>
                TODOS
              </NavLink>

              <NavLink to="/profile" style={navLinkStyle}>
                PROFILE
              </NavLink>
          </>
          )}

        </li>
      </ul>
    </nav>
  );
}