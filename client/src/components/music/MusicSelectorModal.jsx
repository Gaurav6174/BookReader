import { useState, useRef, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext.jsx';

export default function MusicSelectorModal({ onClose }) {
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    playCustomLink,
  } = useMusic();

  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState('');
  const modalRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  function handleCustomSubmit(e) {
    e.preventDefault();
    setInputError('');
    if (!customInput.trim()) return;

    const ok = playCustomLink(customInput);
    if (ok) {
      setCustomInput('');
    } else {
      setInputError('Please enter a valid YouTube video or playlist link.');
    }
  }

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 p-4 rounded-xl shadow-2xl animate-fade-in text-white"
      style={{
        background: 'rgba(16, 16, 20, 0.96)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)',
        borderRadius: '14px',
      }}
      role="dialog"
      aria-label="Background Study Music Selector"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎵</span>
          <div>
            <h3
              className="text-base font-bold text-white leading-tight"
              style={{ fontFamily: "'Gaegu', cursive" }}
            >
              Study Background Music
            </h3>
            <p className="text-[11px] text-white/50" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Plays softly in the background while you read
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs"
          aria-label="Close music selector"
          title="Minimize selector"
        >
          ✕
        </button>
      </div>

      {/* Active Playback Bar */}
      <div className="mt-3 p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-white animate-pulse h-3 rounded-full" />
                <span className="w-1 bg-white animate-pulse h-2 rounded-full" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-white animate-pulse h-3.5 rounded-full" style={{ animationDelay: '300ms' }} />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-white/30" />
            )}
            <p
              className="text-xs font-bold text-white truncate"
              style={{ fontFamily: "'Gaegu', cursive" }}
            >
              {currentTrack?.title || 'No track selected'}
            </p>
          </div>
          <p className="text-[10px] text-white/40 truncate mt-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            {isPlaying ? 'Now Playing' : 'Paused'} • Volume: {volume}%
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md text-xs"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Volume Slider */}
      <div className="mt-3 flex items-center gap-2 px-1 text-xs text-white/60">
        <span>🔈</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-white h-1 bg-white/20 rounded cursor-pointer"
          aria-label="Music volume"
        />
        <span>🔊</span>
      </div>

      {/* Tracks Selection List */}
      <div className="mt-3.5">
        <p
          className="text-xs text-white/50 uppercase tracking-wider mb-2 font-bold px-1"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          Select Track or Playlist:
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {tracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-3 group border ${
                  isCurrent && isPlaying
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 text-white/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                    {track.icon}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold truncate leading-tight group-hover:text-white"
                      style={{ fontFamily: "'Gaegu', cursive" }}
                    >
                      {track.title}
                    </p>
                    <p
                      className="text-[11px] text-white/45 truncate mt-0.5"
                      style={{ fontFamily: "'Patrick Hand', cursive" }}
                    >
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-md shrink-0 transition-all ${
                    isCurrent && isPlaying
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                  }`}
                >
                  {isCurrent && isPlaying ? 'Playing' : '▶ Play'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Link Input */}
      <form onSubmit={handleCustomSubmit} className="mt-3.5 pt-3 border-t border-white/10">
        <label
          htmlFor="yt-link-input"
          className="block text-[11px] text-white/50 mb-1"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          Or paste any YouTube video or playlist link:
        </label>
        <div className="flex gap-2">
          <input
            id="yt-link-input"
            type="text"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setInputError('');
            }}
            placeholder="https://youtube.com/watch?v=..."
            className="sketch-input text-xs py-1.5 flex-1"
          />
          <button
            type="submit"
            className="sketch-btn sketch-btn-primary sketch-btn-sm whitespace-nowrap text-xs py-1"
          >
            ▶ Play
          </button>
        </div>
        {inputError && (
          <p className="text-[11px] text-red-400 mt-1" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            {inputError}
          </p>
        )}
      </form>
    </div>
  );
}
