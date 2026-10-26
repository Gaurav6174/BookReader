import { useState } from 'react';
import { useProductivity } from '../../context/ProductivityContext.jsx';

export default function ProductivitySection() {
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
    setDurationInMinutes,
    stats,
    loadingStats,
    openModal,
  } = useProductivity();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('book-reader-productivity-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('book-reader-productivity-collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const presets = [
    { label: '15m', mins: 15 },
    { label: '25m', mins: 25 },
    { label: '45m', mins: 45 },
    { label: '60m', mins: 60 },
  ];

  return (
    <section
      className={`rounded-2xl transition-all duration-300 relative overflow-hidden ${
        isCollapsed ? 'mb-6 p-3.5 sm:p-4' : 'mb-8 p-5 sm:p-6'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      aria-label="Study Productivity Dashboard"
    >
      {/* Header with Title, Quick Summary (if collapsed), Open Modal, and Collapse Button */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          !isCollapsed ? 'mb-5 pb-4 border-b border-white/10' : ''
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={toggleCollapse}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg sm:text-xl border border-white/15 shadow-sm shrink-0">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                Productivity & Focus Overview
              </h2>

              {/* Collapsed quick pill summary */}
              {isCollapsed && (
                <span
                  className="hidden md:inline-flex items-center gap-2 text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 animate-fade-in"
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                >
                  <span>⏱️ {formatHoursMinutes(studySecondsToday)}</span>
                  <span>•</span>
                  <span>🔤 {loadingStats ? '…' : stats.wordsCount} words</span>
                  <span>•</span>
                  <span>📝 {loadingStats ? '…' : stats.notesCount} quotes</span>
                  {isRunning && (
                    <>
                      <span>•</span>
                      <span className="text-white font-mono flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {formatTimeRemaining(timeLeft)}
                      </span>
                    </>
                  )}
                </span>
              )}
            </div>

            {!isCollapsed ? (
              <p className="text-xs text-white/50" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Track your dedicated study hours, vocabulary expansion, and preserved quotes
              </p>
            ) : (
              <p className="text-xs text-white/40 md:hidden" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                ⏱️ {formatHoursMinutes(studySecondsToday)} · 🔤 {stats.wordsCount} words · 📝 {stats.notesCount} quotes
              </p>
            )}
          </div>
        </div>

        {/* Right Action Controls: Focus Hub & Collapse Toggle Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={openModal}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm text-xs px-3 py-1.5 flex items-center gap-1.5 text-white/80 hover:text-white"
            title="Open Focus Timer & Details"
          >
            <span>⏱️ Open Focus Hub</span>
            <span className="text-white/40">↗</span>
          </button>

          {/* Collapse/Expand Arrow Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 flex items-center justify-center w-8 h-8"
            title={isCollapsed ? 'Expand Productivity Overview' : 'Hide Productivity Overview'}
            aria-label={isCollapsed ? 'Expand Productivity Overview' : 'Hide Productivity Overview'}
            aria-expanded={!isCollapsed}
          >
            <span
              className={`text-xs transition-transform duration-300 inline-block font-mono ${
                isCollapsed ? 'rotate-180' : 'rotate-0'
              }`}
            >
              ▲
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Key Metrics (Shown when expanded) */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Metric 1: Study Time Today */}
          <div
            className="p-4 rounded-xl transition-all duration-200 hover:border-white/20 group"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Study Today
              </span>
              <span className="text-sm group-hover:scale-110 transition-transform">⏳</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {formatHoursMinutes(studySecondsToday)}
              </span>
            </div>
            <p className="text-[11px] text-white/40 mt-1 truncate" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {formatHoursMinutes(studySecondsTotal)} total reading time
            </p>
          </div>

          {/* Metric 2: Words Saved */}
          <div
            className="p-4 rounded-xl transition-all duration-200 hover:border-white/20 group"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Words Saved
              </span>
              <span className="text-sm group-hover:scale-110 transition-transform">🔤</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {loadingStats ? '…' : stats.wordsCount}
              </span>
              <span className="text-xs text-white/50 font-normal">terms</span>
            </div>
            <p className="text-[11px] text-white/40 mt-1 truncate" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {stats.recentWords?.[0] ? `Latest: "${stats.recentWords[0].word}"` : 'Expand your vocabulary'}
            </p>
          </div>

          {/* Metric 3: Quotes Saved */}
          <div
            className="p-4 rounded-xl transition-all duration-200 hover:border-white/20 group"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Quotes Saved
              </span>
              <span className="text-sm group-hover:scale-110 transition-transform">📝</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {loadingStats ? '…' : stats.notesCount}
              </span>
              <span className="text-xs text-white/50 font-normal">lines</span>
            </div>
            <p className="text-[11px] text-white/40 mt-1 truncate" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {stats.recentNotes?.[0] ? `"${stats.recentNotes[0].content.slice(0, 22)}…"` : 'Preserve memorable lines'}
            </p>
          </div>

          {/* Metric 4: Integrated Study Timer */}
          <div
            className="p-4 rounded-xl transition-all duration-200 hover:border-white/20 flex flex-col justify-between"
            style={{
              background: isRunning ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
              border: isRunning ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between text-white/50 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Focus Timer
              </span>
              {isRunning && (
                <span className="flex items-center gap-1 text-[10px] text-white/80 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Active
                </span>
              )}
            </div>

            <div className="flex items-center justify-between my-1">
              <span
                className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight"
                style={{ fontFamily: "'Gaegu', monospace" }}
              >
                {formatTimeRemaining(timeLeft)}
              </span>

              {/* Play/Pause Button */}
              {!isRunning ? (
                <button
                  onClick={() => (timeLeft > 0 ? resumeTimer() : startTimer(initialDuration))}
                  className="sketch-btn sketch-btn-primary px-3 py-1 text-xs font-bold"
                  aria-label="Start study session"
                >
                  ▶ Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="sketch-btn sketch-btn-secondary px-3 py-1 text-xs font-bold"
                  aria-label="Pause study session"
                >
                  ⏸ Pause
                </button>
              )}
            </div>

            {/* Quick preset selector */}
            <div className="flex items-center gap-1 mt-1 pt-1 border-t border-white/5">
              {presets.map((p) => {
                const isSelected = initialDuration === p.mins * 60;
                return (
                  <button
                    key={p.mins}
                    onClick={() => setDurationInMinutes(p.mins)}
                    className={`flex-1 py-0.5 text-[10px] rounded transition-all text-center ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                    style={{ fontFamily: "'Patrick Hand', cursive" }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
