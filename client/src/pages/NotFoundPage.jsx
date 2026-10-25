import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      className="notebook-bg min-h-screen flex flex-col items-center justify-center text-center px-6"
      role="main"
    >
      <div className="sketch-card max-w-md w-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <span className="text-7xl mb-4" aria-hidden="true">🗺️</span>
        <h1
          className="text-4xl mb-3"
          style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
        >
          Page Not Found
        </h1>
        <p className="muted mb-8 text-base" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          Looks like this page went on its own adventure…
        </p>
        <Link to="/" className="sketch-btn sketch-btn-primary text-base">
          🏠 Back to Books
        </Link>
      </div>
    </div>
  );
}
