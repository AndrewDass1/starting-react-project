import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Your Profile</h2>

      {!user && <p>No user data available.</p>}

      {user && (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      )}
    </div>
  );
}