import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    ({ message, type = 'info', duration = 3500 }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TYPE_STYLES = {
  success: { border: 'rgba(255,255,255,0.3)', icon: '✓' },
  error: { border: 'rgba(220,38,38,0.6)', icon: '✕' },
  info: { border: 'rgba(255,255,255,0.25)', icon: 'ℹ' },
  warning: { border: 'rgba(255,255,255,0.3)', icon: '⚠' },
};

function ToastItem({ toast, onDismiss }) {
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-3 px-4 py-3 max-w-sm animate-toast-in text-white"
      style={{
        background: 'rgba(15, 15, 15, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${style.border}`,
        boxShadow: '0 12px 36px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      <span className="text-lg leading-none mt-0.5" aria-hidden="true">
        {style.icon}
      </span>
      <span className="flex-1 text-sm text-white/90 leading-snug">{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-white/60 hover:text-white ml-1 leading-none text-lg font-bold"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
