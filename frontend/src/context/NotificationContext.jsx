import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-mutedgreen/10 border-mutedgreen/30 text-mutedgreen dark:text-emerald-200'
                : toast.type === 'error'
                ? 'bg-red/10 border-red/30 text-red dark:text-rose-200'
                : 'bg-charcoal/10 border-charcoal/30 text-charcoal dark:text-indigo-200'
            }`}
          >
            <div className="mr-3 mt-0.5">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-mutedgreen" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red" />
              ) : (
                <Info className="w-5 h-5 text-charcoal" />
              )}
            </div>
            <div className="flex-1">
              {toast.title && <h4 className="font-semibold text-sm mb-0.5">{toast.title}</h4>}
              <p className="text-xs opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-slate/80 hover:text-slate dark:hover:text-slate/60 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return {
    ...context,
    success: (msg, title) => context.addToast(msg, 'success', title),
    error: (msg, title) => context.addToast(msg, 'error', title),
    info: (msg, title) => context.addToast(msg, 'info', title),
  };
};



