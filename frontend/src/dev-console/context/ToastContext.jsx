import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 3800) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              border: 'border-emerald-500/40',
              bg: 'bg-slate-900/95',
              text: 'text-emerald-300',
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
            },
            error: {
              border: 'border-rose-500/40',
              bg: 'bg-slate-900/95',
              text: 'text-rose-300',
              icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
            },
            warning: {
              border: 'border-amber-500/40',
              bg: 'bg-slate-900/95',
              text: 'text-amber-300',
              icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
            },
            info: {
              border: 'border-sky-500/40',
              bg: 'bg-slate-900/95',
              text: 'text-sky-300',
              icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
            },
          }[toast.type || 'info'];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl shadow-black/40 backdrop-blur-md transition-all animate-slide-in text-xs font-medium ${typeConfig.bg} ${typeConfig.border} text-slate-200`}
            >
              <div className="flex items-center gap-2.5">
                {typeConfig.icon}
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
