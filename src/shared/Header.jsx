import Navigation from './Navigation.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';
import styles from '../header.module.css';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.headerContainer}>
      <div>
        <h1 className={styles.appTitle}>TODO APP</h1>

        <Navigation />

        {isAuthenticated && (
          <div className={styles.logoutContainer}>
            <Logoff />
          </div>
        )}
      </div>
    </header>
  );
}