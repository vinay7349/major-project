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
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-200'
            }`}
          >
            <div className="mr-3 mt-0.5">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : (
                <Info className="w-5 h-5 text-indigo-500" />
              )}
            </div>
            <div className="flex-1">
              {toast.title && <h4 className="font-semibold text-sm mb-0.5">{toast.title}</h4>}
              <p className="text-xs opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useToast = () => useContext(NotificationContext);
