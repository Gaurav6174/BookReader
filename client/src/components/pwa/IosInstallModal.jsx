import { usePwa } from '../../context/PwaContext.jsx';

export default function IosInstallModal() {
  const { showIosGuide, setShowIosGuide } = usePwa();

  if (!showIosGuide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setShowIosGuide(false)}
      role="dialog"
      aria-label="Install on iOS Instructions"
    >
      <div
        className="w-full max-w-sm p-6 rounded-2xl border border-white/20 text-white shadow-2xl relative"
        style={{
          background: 'rgba(16, 16, 20, 0.96)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowIosGuide(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xl">
            📲
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Gaegu', cursive" }}>
              Install on iOS
            </h3>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Add Book Companion to your Home Screen
            </p>
          </div>
        </div>

        <ol className="space-y-3 text-xs text-white/80 my-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              1
            </span>
            <span>Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px]">⎋</span> at the bottom of Safari.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              2
            </span>
            <span>Scroll down and select <strong>Add to Home Screen</strong> <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-[11px] font-bold">⊞</span>.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              3
            </span>
            <span>Tap <strong>Add</strong> in the top right corner.</span>
          </li>
        </ol>

        <button
          onClick={() => setShowIosGuide(false)}
          className="sketch-btn sketch-btn-primary w-full py-2 text-xs font-bold justify-center mt-2"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
