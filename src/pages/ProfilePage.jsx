import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { isAuthenticated, token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/todos', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load statistics');
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p>User: {user?.name ?? 'Unknown'}</p>
      <p>Authenticated: yes</p>
      <p>Total todos: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Active: {stats.active}</p>
      <p>Completion: {stats.completion}%</p>
      <p>Status: {stats.completion === 100 ? 'All done!' : 'Still working...'}</p>
    </div>
  );
}