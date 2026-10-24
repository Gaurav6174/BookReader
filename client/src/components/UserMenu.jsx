import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    logout();
    toast({ message: 'Logged out successfully.', type: 'info' });
    navigate('/login');
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="sketch-badge text-xs hidden sm:inline-flex"
          style={{ background: 'var(--color-yellow)', color: '#111111' }}
          title={user.email}
        >
          👤 {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="sketch-btn sketch-btn-secondary sketch-btn-sm"
          aria-label="Log out of your account"
          title="Log Out"
        >
          🚪 Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="sketch-btn sketch-btn-secondary sketch-btn-sm"
        aria-label="Log in"
      >
        🔑 Log In
      </Link>
      <Link
        to="/register"
        className="sketch-btn sketch-btn-primary sketch-btn-sm"
        aria-label="Create an account"
      >
        ✨ Sign Up
      </Link>
    </div>
  );
}
