import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleGoToTodos() {
    navigate('/todos');
  }

  function handleGoToLogin() {
    navigate('/login');
  }

  return (
    <div>
      <h2>WELCOME TO THE TODO APP</h2>
      <p>Manage your tasks, track completion, and view your profile statistics.</p>

      {isAuthenticated ? (
        <>
          <p>You are logged in.</p>
          <button onClick={handleGoToTodos}>GO TO TODOS</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <button onClick={handleGoToLogin}>LOG IN</button>
        </>
      )}
    </div>
  );
}