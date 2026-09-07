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
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load statistics');
        }

        const tasks = await response.json();

        const total = tasks.length;
        const completed = tasks.filter((t) => t.isCompleted).length;
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

  if (loading) {
    return <p>Loading profile and statistics...</p>;
  }

  if (error) {
    return <p>Error loading statistics: {error}</p>;
  }

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p>User: {user?.name ?? 'Unknown user'}</p>
      <p>Token: {token ? 'Present' : 'Missing'}</p>

      <h3>Todo Statistics</h3>
      <p>Total tasks: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Active: {stats.active}</p>
      <p>Completion: {stats.completion}%</p>
      <p>
        Status:{' '}
        {stats.completion === 100
          ? 'All tasks completed!'
          : 'You still have work to do.'}
      </p>
    </div>
  );
}