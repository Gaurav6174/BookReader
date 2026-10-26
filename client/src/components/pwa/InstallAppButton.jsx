import { usePwa } from '../../context/PwaContext.jsx';

export default function InstallAppButton({ className = '', variant = 'pill' }) {
  const { canInstall, installApp } = usePwa();

  if (!canInstall) {
    return null;
  }

  if (variant === 'menu-item') {
    return (
      <button
        type="button"
        onClick={installApp}
        className="w-full text-left px-3.5 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2.5 transition-colors"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-sm">📲</span>
        <div className="flex-1">
          <div className="font-bold">Install App</div>
          <div className="text-[10px] text-white/40">Add to desktop or home screen</div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={installApp}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 border border-white/20 hover:border-white/40 bg-white/[0.06] hover:bg-white/[0.12] text-white/90 hover:text-white shadow-sm active:scale-95 ${className}`}
      style={{ fontFamily: "'Patrick Hand', cursive" }}
      title="Install Book Reading Companion for offline and direct access"
      aria-label="Install Book Reading Companion application"
    >
      <span className="text-sm shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
        📲
      </span>
      <span className="font-bold tracking-wide hidden sm:inline-block">
        Install App
      </span>
    </button>
  );
}
