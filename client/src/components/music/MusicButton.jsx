import { useState } from 'react';
import { useMusic } from '../../context/MusicContext.jsx';
import MusicSelectorModal from './MusicSelectorModal.jsx';

export default function MusicButton() {
  const { currentTrack, isPlaying, isPopupOpen, setIsPopupOpen, togglePlay } = useMusic();
  const [showQuickControls, setShowQuickControls] = useState(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setShowQuickControls(true)}
      onMouseLeave={() => setShowQuickControls(false)}
    >
      {/* Navbar Music Trigger Button */}
      <button
        type="button"
        onClick={() => setIsPopupOpen((prev) => !prev)}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
          isPlaying
            ? 'bg-white/15 text-white border-white/30 shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent hover:border-white/15'
        }`}
        style={{ fontFamily: "'Patrick Hand', cursive" }}
        aria-label="Toggle study background music selector"
        title={isPlaying ? `Playing: ${currentTrack?.title} (Click to change)` : 'Play study background music'}
      >
        {/* Animated Equalizer Waveform when playing, otherwise music note */}
        {isPlaying ? (
          <span className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <span
              className="w-[2.5px] bg-white rounded-full animate-bounce"
              style={{ height: '70%', animationDuration: '600ms' }}
            />
            <span
              className="w-[2.5px] bg-white rounded-full animate-bounce"
              style={{ height: '100%', animationDuration: '450ms', animationDelay: '150ms' }}
            />
            <span
              className="w-[2.5px] bg-white rounded-full animate-bounce"
              style={{ height: '60%', animationDuration: '750ms', animationDelay: '300ms' }}
            />
          </span>
        ) : (
          <span className="text-sm shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
            🎵
          </span>
        )}

        {/* Label */}
        <span className="font-medium hidden sm:inline-block truncate max-w-[110px]">
          {isPlaying ? currentTrack?.title.split(' ')[0] : 'Music'}
        </span>

        {/* Tiny Dropdown / Minimized indicator */}
        <span
          className="text-[9px] text-white/40 transition-transform duration-200"
          style={{ transform: isPopupOpen ? 'rotate(180deg)' : 'none' }}
        >
          ▼
        </span>
      </button>

      {/* Mini quick pause/play tooltip when playing and hovering */}
      {isPlaying && showQuickControls && !isPopupOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-40 px-2 py-1 rounded-md bg-black/90 border border-white/15 text-[11px] text-white flex items-center gap-2 shadow-lg animate-fade-in whitespace-nowrap"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          <span className="truncate max-w-[130px]">{currentTrack?.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 text-white"
            title="Pause playback"
          >
            ⏸ Pause
          </button>
        </div>
      )}

      {/* Full Music Selection Popup Window */}
      {isPopupOpen && <MusicSelectorModal onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}
