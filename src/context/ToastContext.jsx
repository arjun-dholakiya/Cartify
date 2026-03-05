import { createContext, useContext, useState, useCallback } from 'react';

/* ─── Toast Context ───────────────────────────────────────────
   Provides showToast(message, type) globally.
   Types: 'success' | 'error' | 'info' | 'warning'
   Auto-dismisses after 3 seconds.
──────────────────────────────────────────────────────────────── */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /* Add a new toast — max 4 visible at once */
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();

    setToasts((prev) => {
      const next = [...prev.slice(-3), { id, message, type }];
      return next;
    });

    /* Auto-dismiss after 3 seconds */
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* Manually dismiss a toast */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast renderer — fixed position, outside main layout */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

/* ─── Toast Container ── */
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    /* Mobile: full-width bottom-center | Tablet: wider centered | Desktop: bottom-right */
    <div
      className="fixed bottom-4 left-2 right-2 sm:left-auto sm:right-5 sm:w-80 md:w-96 lg:w-auto z-9999 flex flex-col gap-2 items-stretch sm:items-end"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ─── Individual Toast Item ── */
const TOAST_STYLES = {
  success: {
    icon: '✅',
    borderColor: 'var(--primary)',
    iconBg: 'var(--primary-light)',
    textColor: 'var(--primary-dark)'
  },
  error: {
    icon: '❌',
    borderColor: '#ef4444',
    iconBg: '#fef2f2',
    textColor: '#dc2626'
  },
  info: {
    icon: 'ℹ️',
    borderColor: 'var(--border-2)',
    iconBg: 'var(--surface-2)',
    textColor: 'var(--text-2)'
  },
  warning: {
    icon: '⚠️',
    borderColor: 'var(--accent)',
    iconBg: 'var(--accent-light)',
    textColor: 'var(--accent-dark)'
  }
};

function ToastItem({ toast, onDismiss }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl fade-in w-full cursor-pointer"
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${style.borderColor}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}
      onClick={() => onDismiss(toast.id)}
      role="alert"
    >
      {/* Icon */}
      <span
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0"
        style={{ background: style.iconBg }}
      >
        {style.icon}
      </span>

      {/* Message */}
      <p
        className="text-sm sm:text-base font-semibold flex-1 leading-snug"
        style={{ color: style.textColor, fontFamily: "'DM Sans', sans-serif" }}
      >
        {toast.message}
      </p>

      {/* Dismiss x */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast.id);
        }}
        className="text-xl leading-none shrink-0 opacity-40 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--text-3)' }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

/* ─── Hook ── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
