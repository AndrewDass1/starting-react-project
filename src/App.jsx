import { Routes, Route } from 'react-router';

import Header from './shared/Header.jsx';
import Navigation from './shared/Navigation.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import RequireAuth from './components/RequireAuth.jsx';

function App() {
  return (
    <div>
      <Header />
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;