import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from './Icons';
import { ToastNotification } from '../types';
import { cn } from '../utils';

interface ToastProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
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
    success: <CheckCircle2 className="w-5 h-5 text-rosewood-500" />,
    error: <XCircle className="w-5 h-5 text-lcoral-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-bronze-500" />,
    info: <Info className="w-5 h-5 text-lavender-500" />
  };

  const styles = {
    success: 'border-rosewood-200 dark:border-rosewood-800 bg-rosewood-50/90 dark:bg-rosewood-950/80',
    error: 'border-lcoral-200 dark:border-lcoral-800 bg-lcoral-50/90 dark:bg-lcoral-950/80',
    warning: 'border-bronze-200 dark:border-bronze-800 bg-bronze-50/90 dark:bg-bronze-950/80',
    info: 'border-lavender-200 dark:border-lavender-800 bg-lavender-50/90 dark:bg-lavender-950/80'
  };

  const progressColors = {
    success: 'bg-rosewood-500',
    error: 'bg-lcoral-500',
    warning: 'bg-bronze-500',
    info: 'bg-lavender-500'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        "pointer-events-auto w-80 rounded-2xl border shadow-lg backdrop-blur-md",
        "overflow-hidden",
        styles[toast.type]
      )}
    >
      <div className="p-4 flex gap-3">
        <motion.div 
          className="flex-shrink-0 pt-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          {icons[toast.type]}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-dusk-900 dark:text-dusk-100">{toast.title}</h4>
          <p className="text-xs text-dusk-600 dark:text-dusk-400 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <motion.button 
          onClick={() => onRemove(toast.id)} 
          className="flex-shrink-0 text-lavender-400 hover:text-dusk-600 dark:hover:text-dusk-200 self-start p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress bar */}
      <motion.div 
        className={cn("h-1", progressColors[toast.type])}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
};
