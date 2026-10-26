import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import InstallAppButton from './pwa/InstallAppButton.jsx';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    toast({ message: 'Logged out successfully.', type: 'info' });
    navigate('/login');
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative inline-block text-left" ref={menuRef}>
        {/* User button: clean, seamless, no clunky box borders */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/85 hover:text-white hover:bg-white/[0.12] border border-transparent hover:border-white/20 active:scale-95 transition-all duration-200"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white group-hover:scale-105 group-hover:border-white/40 transition-all">
            👤
          </span>
          <span className="font-medium">{user.name}</span>
          <span
            className="text-[10px] text-white/40 transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            ▼
          </span>
        </button>

        {/* Smooth floating profile popup window */}
        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-60 z-50 p-3 rounded-xl animate-fade-in"
            style={{
              background: 'rgba(18, 18, 18, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}
          >
            {/* User profile info */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-base shrink-0">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-bold text-white truncate leading-tight"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs text-white/45 truncate mt-0.5"
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Install App Button if available */}
            <div className="py-1 border-b border-white/10">
              <InstallAppButton variant="menu-item" />
            </div>

            {/* Logout button shifted inside */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-150"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                <span>🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="px-2.5 py-1 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md active:scale-95 transition-all duration-150"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        🔑 Log In
      </Link>
      <Link
        to="/register"
        className="px-3 py-1 text-sm bg-white text-black font-bold rounded-md hover:bg-white/90 hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-150"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        ✨ Sign Up
      </Link>
    </div>
  );
}
