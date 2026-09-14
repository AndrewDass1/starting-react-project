import Navigation from './Navigation.jsx';
import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

import '../header.module.css';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <h1>TODO APP</h1>

      <header>
        <Navigation />
        {isAuthenticated && <Logoff />}
      </header>
    </>
  );
}