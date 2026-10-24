import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name.trim(), email.trim(), password);
      toast({ message: `Account created! Welcome, ${user.name}!`, type: 'success' });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.');
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
          style={{ borderLeft: '6px solid var(--color-green)' }}
        >
          <div className="text-center mb-6">
            <span className="text-4xl" aria-hidden="true">✨</span>
            <h1 className="text-3xl font-bold mt-2 leading-tight" style={{ fontFamily: "'Gaegu', cursive" }}>
              Create an Account
            </h1>
            <p className="text-sm muted mt-1" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Start saving vocabulary and notes from your books
            </p>
          </div>

          {error && (
            <div
              className="p-3 mb-4 rounded-none border border-red-500 bg-red-100 text-red-800 text-sm"
              role="alert"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-sm mb-1 font-medium">
                Your Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="sketch-input"
                placeholder="Jane Reader"
                required
                maxLength={100}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm mb-1 font-medium">
                Email Address
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="block text-sm mb-1 font-medium">
                Password <span className="muted text-xs">(min 6 characters)</span>
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sketch-input"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm mb-1 font-medium">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="sketch-input"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="sketch-btn sketch-btn-primary w-full justify-center py-2.5 mt-2"
              style={{ background: 'var(--color-green)' }}
            >
              {loading ? '⏳ Creating account…' : '🎉 Create Account'}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold underline text-blue-600 dark:text-blue-400">
                Log in here
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
