import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      className="notebook-bg min-h-screen flex flex-col items-center justify-center text-center px-6"
      role="main"
    >
      <span className="text-8xl mb-6" aria-hidden="true">🗺️</span>
      <h1
        className="text-5xl mb-3"
        style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
      >
        Page Not Found
      </h1>
      <p className="muted mb-8 text-lg" style={{ fontFamily: "'Patrick Hand', cursive" }}>
        Looks like this page went on its own adventure…
      </p>
      <Link to="/" className="sketch-btn sketch-btn-primary text-base">
        🏠 Back to Books
      </Link>
    </div>
  );
}
