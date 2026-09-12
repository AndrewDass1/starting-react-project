import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>PAGE NOT FOUND</h2>
      <p>THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST. TRY ONE OF THESE:</p>
      
        <Link to="/">HOME</Link>
        <br></br>
        
        <Link to="/about">ABOUT</Link>
        <br></br>
        
        <Link to="/login">LOGIN</Link>
        <br></br>

        {isAuthenticated && (
          <>
              <Link to="/todos">Todos</Link>
              <Link to="/profile">Profile</Link>
          </>
        )}
      
    </div>
  );
}