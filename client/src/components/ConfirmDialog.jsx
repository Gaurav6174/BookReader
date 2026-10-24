import { useEffect, useRef } from 'react';

/**
 * Accessible confirmation dialog.
 * Traps focus inside while open.
 */
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmClass = 'sketch-btn sketch-btn-danger' }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  // Trap focus
  useEffect(() => {
    if (open) {
      // Focus the cancel button by default (safer)
      setTimeout(() => cancelRef.current?.focus(), 50);
      const handleKey = (e) => {
        if (e.key === 'Escape') onCancel();
        if (e.key === 'Tab') {
          const focusable = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="dialog-box animate-fade-in" ref={dialogRef}>
        <h2 id="confirm-title" className="text-xl mb-3" style={{ fontFamily: "'Gaegu', cursive" }}>
          ⚠️ {title}
        </h2>
        <p className="text-sm mb-6 text-gray-700" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {message}
        </p>
        <div className="flex gap-3 justify-end flex-wrap">
          <button ref={cancelRef} onClick={onCancel} className="sketch-btn sketch-btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
