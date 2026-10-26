import { useState, useRef, useEffect } from 'react';
import { useProductivity } from '../../context/ProductivityContext.jsx';

export default function ProductivityModal({ onClose }) {
  const {
    studySecondsToday,
    studySecondsTotal,
    formatHoursMinutes,
    formatTimeRemaining,
    isRunning,
    timeLeft,
    initialDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setDurationInMinutes,
    stats,
    loadingStats,
  } = useProductivity();

  const [customMin, setCustomMin] = useState('');
  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'words' | 'quotes'
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

  // Circular progress calculation
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = initialDuration > 0 ? timeLeft / initialDuration : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const presets = [
    { label: '15m', mins: 15 },
    { label: '25m Focus', mins: 25 },
    { label: '45m Deep', mins: 45 },
    { label: '60m Session', mins: 60 },
  ];

  function handleCustomSet(e) {
    e.preventDefault();
    const val = parseInt(customMin, 10);
    if (!isNaN(val) && val > 0) {
      setDurationInMinutes(val);
      setCustomMin('');
    }
  }

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-full mt-2 w-84 sm:w-[420px] z-50 p-5 rounded-2xl shadow-2xl animate-fade-in text-white"
      style={{
        background: 'rgba(14, 14, 18, 0.96)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.15)',
        borderRadius: '16px',
      }}
      role="dialog"
      aria-label="Productivity & Focus Dashboard"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⏱️</span>
          <div>
            <h3
              className="text-lg font-bold text-white leading-tight"
              style={{ fontFamily: "'Gaegu', cursive" }}
            >
              Productivity & Focus
            </h3>
            <p className="text-[11px] text-white/50" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Study time, vocabulary, and quotes tracker
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs"
          aria-label="Close productivity modal"
        >
          ✕
        </button>
      </div>

      {/* ─── 3 Key Stats Counters ─────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        {/* Study Hours */}
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            Study Time
          </p>
          <p className="text-base font-bold text-white" style={{ fontFamily: "'Gaegu', cursive" }}>
            {formatHoursMinutes(studySecondsToday)}
          </p>
          <p className="text-[9px] text-white/40 truncate">
            {formatHoursMinutes(studySecondsTotal)} total
          </p>
        </div>

        {/* Words Saved */}
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            Words Saved
          </p>
          <p className="text-base font-bold text-white" style={{ fontFamily: "'Gaegu', cursive" }}>
            {loadingStats ? '…' : stats.wordsCount}
          </p>
          <p className="text-[9px] text-white/40">vocabulary</p>
        </div>

        {/* Quotes Saved */}
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            Quotes Saved
          </p>
          <p className="text-base font-bold text-white" style={{ fontFamily: "'Gaegu', cursive" }}>
            {loadingStats ? '…' : stats.notesCount}
          </p>
          <p className="text-[9px] text-white/40">reflections</p>
        </div>
      </div>

      {/* ─── Sub-Navigation Tabs ──────────────────────────────── */}
      <div className="flex border-b border-white/10 pb-2 mb-3 gap-1">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all ${
            activeTab === 'timer'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          ⏱️ Focus Timer
        </button>
        <button
          onClick={() => setActiveTab('words')}
          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all ${
            activeTab === 'words'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          🔤 Recent Words
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all ${
            activeTab === 'quotes'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          📝 Recent Quotes
        </button>
      </div>

      {/* ─── TAB 1: THE RUNNING TIMER ───────────────────────── */}
      {activeTab === 'timer' && (
        <div className="flex flex-col items-center py-2 animate-fade-in">
          {/* Beautiful Circular Glow Ring */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
              {/* Subtle background track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-white/10"
                strokeWidth="5"
                fill="none"
              />
              {/* Glowing active countdown stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="white"
                strokeWidth="5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                style={{
                  filter: isRunning ? 'drop-shadow(0 0 6px rgba(255,255,255,0.7))' : 'none',
                }}
              />
            </svg>

            {/* Centered Large Countdown Readout */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span
                className="text-3xl font-mono font-bold tracking-tight text-white drop-shadow-md"
                style={{ fontFamily: "'Gaegu', monospace" }}
              >
                {formatTimeRemaining(timeLeft)}
              </span>
              <span
                className="text-[11px] text-white/50 uppercase tracking-widest mt-0.5 font-bold"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                {timeLeft === 0
                  ? 'Completed! ✨'
                  : isRunning
                  ? 'Focusing… 📖'
                  : 'Ready'}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-1.5 flex-wrap justify-center mt-2 mb-3">
            {presets.map((p) => {
              const isSelected = initialDuration === p.mins * 60;
              return (
                <button
                  key={p.mins}
                  onClick={() => setDurationInMinutes(p.mins)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-white/20 border-white text-white font-bold'
                      : 'bg-white/[0.04] border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Duration Input */}
          <form onSubmit={handleCustomSet} className="flex gap-2 items-center mb-4">
            <input
              type="number"
              min="1"
              max="360"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder="e.g. 35 mins"
              className="sketch-input text-xs py-1 px-3 w-32 text-center"
            />
            <button
              type="submit"
              disabled={!customMin}
              className="sketch-btn sketch-btn-secondary sketch-btn-sm text-xs py-1 px-3"
            >
              Set
            </button>
          </form>

          {/* Big Tactile Action Controls */}
          <div className="flex gap-3 w-full justify-center">
            {!isRunning ? (
              <button
                onClick={() => (timeLeft > 0 ? resumeTimer() : startTimer(initialDuration))}
                className="sketch-btn sketch-btn-primary flex-1 justify-center py-2 text-sm shadow-lg font-bold"
              >
                ▶ {timeLeft === initialDuration ? 'Start Focus Session' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="sketch-btn sketch-btn-secondary flex-1 justify-center py-2 text-sm font-bold hover:bg-white/20"
              >
                ⏸ Pause
              </button>
            )}

            <button
              onClick={resetTimer}
              className="sketch-btn sketch-btn-secondary px-3.5 py-2 text-xs text-white/60 hover:text-white"
              title="Reset Timer"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: RECENT WORDS ────────────────────────────── */}
      {activeTab === 'words' && (
        <div className="py-1 animate-fade-in max-h-64 overflow-y-auto space-y-2 pr-1">
          {stats.recentWords && stats.recentWords.length > 0 ? (
            stats.recentWords.map((w) => (
              <div
                key={w._id}
                className="p-2 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-sm text-white" style={{ fontFamily: "'Gaegu', cursive" }}>
                    {w.word}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {new Date(w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5 truncate" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  {w.meaning}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              No words saved yet. Read a chapter and save words to see them here!
            </p>
          )}
        </div>
      )}

      {/* ─── TAB 3: RECENT QUOTES ───────────────────────────── */}
      {activeTab === 'quotes' && (
        <div className="py-1 animate-fade-in max-h-64 overflow-y-auto space-y-2 pr-1">
          {stats.recentNotes && stats.recentNotes.length > 0 ? (
            stats.recentNotes.map((n) => (
              <div
                key={n._id}
                className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all"
              >
                <p className="text-xs text-white/90 italic leading-relaxed line-clamp-2" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  "{n.content}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/40 mt-1.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  {n.pageNumber ? <span>page {n.pageNumber}</span> : <span />}
                  <span>{new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              No quotes saved yet. Capture your favorite lines while reading!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
