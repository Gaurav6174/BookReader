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
  success: { bg: '#bbf7d0', border: '#16a34a', icon: '✓' },
  error: { bg: '#fecaca', border: '#dc2626', icon: '✕' },
  info: { bg: '#bfdbfe', border: '#2563eb', icon: 'ℹ' },
  warning: { bg: '#fed7aa', border: '#d97706', icon: '⚠' },
};

function ToastItem({ toast, onDismiss }) {
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-none font-patrick max-w-sm animate-toast-in"
      style={{
        background: style.bg,
        border: `2px solid ${style.border}`,
        boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      <span className="text-lg leading-none mt-0.5" aria-hidden="true">
        {style.icon}
      </span>
      <span className="flex-1 text-sm text-gray-900 leading-snug">{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-gray-600 hover:text-gray-900 ml-1 leading-none text-lg font-bold"
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
