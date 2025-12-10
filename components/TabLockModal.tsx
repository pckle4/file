
import React from 'react';
import { ArrowRight, Lock, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface TabLockModalProps {
  onTakeover: () => void;
}

export const TabLockModal: React.FC<TabLockModalProps> = ({ onTakeover }) => {
  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in rounded-3xl">
        <div className="bg-white dark:bg-[#0F0F0F] border border-slate-200 dark:border-neutral-800 w-full h-full flex flex-col items-center justify-center p-6 text-center animate-slide-up relative overflow-hidden rounded-2xl">
             {/* Decorative elements */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
             
             <div className="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4 relative border border-rose-100 dark:border-rose-900/30 shadow-inner">
                <Lock className="w-8 h-8 text-rose-500" />
             </div>

             <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Session Paused</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-xs font-medium max-w-[240px]">
                Connection active in another tab. Use that tab or take control here.
             </p>

             <div className="space-y-3 relative z-10 w-full max-w-[200px]">
                 <Button 
                   onClick={onTakeover} 
                   size="sm"
                   className="w-full py-3 text-sm font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 border-none"
                 >
                    Use Here Instead
                 </Button>
             </div>
        </div>
    </div>
  );
};
