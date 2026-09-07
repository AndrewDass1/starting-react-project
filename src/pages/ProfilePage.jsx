import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { isAuthenticated, email, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized: please log in again.');
        }

        if (!response.ok) {
          throw new Error('Failed to load statistics.');
        }

        const todos = await response.json();

        const total = todos.length;
        const completed = todos.filter((t) => t.isCompleted).length;
        const active = total - completed;
        const completion =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        setStats({ total, completed, active, completion });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadStats();
    } else {
      setLoading(false);
      setStats(null);
    }
  }, [isAuthenticated, token]);

  if (loading) return <p>Loading profile and statistics...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!isAuthenticated) return <p>You are not logged in.</p>;

  return (
    <div>
      <h2>Your Profile</h2>
      <p>User: {email}</p>
      <p>Token: {token ? 'Present' : 'Missing'}</p>

      {stats && (
        <>
          <h3>Todo Statistics</h3>
          <p>Total todos: {stats.total}</p>
          <p>Completed: {stats.completed}</p>
          <p>Active: {stats.active}</p>
          <p>Completion: {stats.completion}%</p>
          <p>
            Status:{' '}
            {stats.completion === 100
              ? 'All todos completed!'
              : 'You still have todos to finish.'}
          </p>
        </>
      )}
    </div>
  );
}