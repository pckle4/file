import React from 'react';
import { cn } from '../utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className, position = 'top' }) => {
  return (
    <div className={cn("group relative flex items-center justify-center", className)}>
      {children}
      <div className={cn(
        "absolute mb-2 hidden group-hover:block px-2 py-1 bg-slate-900 text-white text-[10px] font-medium rounded-lg whitespace-nowrap z-50 shadow-lg border border-slate-700 transition-opacity opacity-0 group-hover:opacity-100 animate-fade-in",
        position === 'top' ? "bottom-full" : "top-full mt-2"
      )}>
        {content}
        {position === 'top' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        )}
        {position === 'bottom' && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900"></div>
        )}
      </div>
    </div>
  );
};