import { useProductivity } from '../../context/ProductivityContext.jsx';
import ProductivityModal from './ProductivityModal.jsx';

export default function ProductivityNavButton() {
  const { isRunning, timeLeft, formatTimeRemaining, isModalOpen, openModal, closeModal } =
    useProductivity();

  return (
    <div className="relative inline-block text-left">
      {/* Navbar Productivity & Timer Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
          isRunning
            ? 'bg-white/20 text-white border-white/40 shadow-sm animate-pulse'
            : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent hover:border-white/15'
        }`}
        style={{ fontFamily: "'Patrick Hand', cursive" }}
        aria-label="Open productivity dashboard and focus timer"
        title={isRunning ? `Focus timer running: ${formatTimeRemaining(timeLeft)}` : 'Study Productivity & Focus Timer'}
      >
        <span className="text-sm shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
          ⏱️
        </span>

        {/* Dynamic Display: Live Countdown if running, else 'Focus' */}
        <span className="font-medium tracking-wide">
          {isRunning ? (
            <span className="font-mono text-[11px] font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              {formatTimeRemaining(timeLeft)}
            </span>
          ) : (
            <span className="hidden sm:inline-block">Focus</span>
          )}
        </span>
      </button>

      {/* Productivity Modal Dashboard */}
      {isModalOpen && <ProductivityModal onClose={closeModal} />}
    </div>
  );
}
