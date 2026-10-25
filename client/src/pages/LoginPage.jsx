import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast({ message: `Welcome back, ${user.name}!`, type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="notebook-bg min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold" style={{ fontFamily: "'Gaegu', cursive" }}>
          <span>📚</span>
          <span>Book Reading Companion</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className="sketch-card w-full max-w-md animate-fade-in"
        >
          <div className="text-center mb-6">
            <span className="text-4xl" aria-hidden="true">🔑</span>
            <h1 className="text-3xl font-bold mt-2 leading-tight" style={{ fontFamily: "'Gaegu', cursive" }}>
              Welcome Back
            </h1>
            <p className="text-sm muted mt-1" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Log in to your personal reading library
            </p>
          </div>

          {error && (
            <div
              className="p-3 mb-4 border text-sm"
              role="alert"
              style={{ borderColor: 'rgba(220,38,38,0.5)', background: 'rgba(220,38,38,0.12)', color: '#fca5a5', fontFamily: "'Patrick Hand', cursive" }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm mb-1 font-medium">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sketch-input"
                placeholder="reader@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm mb-1 font-medium">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sketch-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="sketch-btn sketch-btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? '⏳ Logging in…' : '🚀 Log In'}
            </button>
          </form>

          <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold underline text-white hover:opacity-80">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
        Book Reading Companion • Your personal vocabulary & notes
      </footer>
    </div>
  );
}
