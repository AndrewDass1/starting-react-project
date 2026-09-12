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

        const data = await response.json();

        const todos = Array.isArray(data)
          ? data
          : Array.isArray(data.tasks)
          ? data.tasks
          : [];

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
      <h2>YOUR PROFILE</h2>

      <p>USER: {email}</p>
      <p>ACCOUNT STATUS: Authenticated</p>

      {stats && (
        <>
          <h3>TODO STATISTICS</h3>
          <p>TOTAL: {stats.total}</p>
          <p>COMPLETED: {stats.completed}</p>
          <p>ACTIVE: {stats.active}</p>
          <p>COMPLETION: {stats.completion}%</p>
        </>
      )}
    </div>
  );
}