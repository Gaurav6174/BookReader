import { useTheme } from '../hooks/useTheme.jsx';

/**
 * ThemeToggle — hand-drawn sketch toggle button for Light/Dark mode.
 */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`sketch-btn whitespace-nowrap ${className}`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        color: '#ffffff',
        borderColor: 'rgba(255,255,255,0.25)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span aria-hidden="true" className="text-base">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
