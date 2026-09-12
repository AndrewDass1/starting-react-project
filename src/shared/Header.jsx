import Navigation from './Navigation.jsx';
import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>TODO APP</h1>
      <Navigation />
      {isAuthenticated && <Logoff />}
    </header>
  );
}