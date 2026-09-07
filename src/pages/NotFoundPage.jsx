import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Try one of these:</p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );
}