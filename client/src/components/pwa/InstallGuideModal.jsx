import { usePwa } from '../../context/PwaContext.jsx';

export default function InstallGuideModal() {
  const { showGuide, setShowGuide, isIos } = usePwa();

  if (!showGuide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setShowGuide(false)}
      role="dialog"
      aria-label="How to install Book Companion"
    >
      <div
        className="w-full max-w-md p-6 rounded-2xl border border-white/20 text-white shadow-2xl relative"
        style={{
          background: 'rgba(16, 16, 20, 0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRadius: '18px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowGuide(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shrink-0">
            📲
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: "'Gaegu', cursive" }}>
              Install Book Companion
            </h3>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Fast desktop & mobile access with offline support
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-4 text-xs text-white/80" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {/* Chrome / Edge on Desktop */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-white text-sm flex items-center gap-2 mb-1">
              <span>💻</span>
              <span>Chrome / Edge Desktop</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Click the <strong className="text-white">Install</strong> icon <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px] font-mono">⊕</span> on the right side of your browser address bar.
            </p>
          </div>

          {/* Android */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-white text-sm flex items-center gap-2 mb-1">
              <span>🤖</span>
              <span>Android (Chrome / Samsung)</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Tap the menu button <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px]">⋮</span> in the top right, then tap <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
            </p>
          </div>

          {/* iOS Safari */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-white text-sm flex items-center gap-2 mb-1">
              <span>🍏</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Tap the <strong className="text-white">Share</strong> button <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px]">⎋</span> at the bottom, then choose <strong className="text-white">"Add to Home Screen"</strong> <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px]">⊞</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGuide(false)}
          className="sketch-btn sketch-btn-primary w-full py-2.5 text-xs font-bold justify-center mt-3"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}
