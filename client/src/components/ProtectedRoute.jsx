import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="notebook-bg min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-bounce" aria-hidden="true">📖</span>
        <span className="ml-3 text-lg muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          Loading your library…
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
