
import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from './Icons';
import { ToastNotification } from '../types';
import { cn } from '../utils';

interface ToastProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/80',
    error: 'border-red-200 bg-red-50/80',
    warning: 'border-amber-200 bg-amber-50/80',
    info: 'border-blue-200 bg-blue-50/80'
  };

  return (
    <div className={cn(
      "pointer-events-auto w-80 p-4 rounded-xl border shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all animate-fade-in flex gap-3",
      borders[toast.type]
    )}>
      <div className="flex-shrink-0 pt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 self-start">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
