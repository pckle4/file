import React from 'react';
import { ArrowRight, Lock, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface TabLockModalProps {
  onTakeover: () => void;
}

export const TabLockModal: React.FC<TabLockModalProps> = ({ onTakeover }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg animate-fade-in">
        <div className="bg-white dark:bg-[#0F0F0F] border border-slate-200 dark:border-neutral-800 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center animate-slide-up relative overflow-hidden">
             {/* Decorative elements */}
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
             <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
             
             <div className="mx-auto w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6 relative border border-rose-100 dark:border-rose-900/30 shadow-inner">
                <Lock className="w-10 h-10 text-rose-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-[#0F0F0F] rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-neutral-800">
                   <ShieldAlert className="w-4 h-4 text-slate-400" />
                </div>
             </div>

             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Session Paused</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm font-medium">
                NW Share is open in another tab. To maintain a secure stable connection, only one tab can be active at a time.
             </p>

             <div className="space-y-4 relative z-10">
                 <Button 
                   onClick={onTakeover} 
                   className="w-full py-4 text-base font-bold shadow-xl shadow-rose-500/20 hover:shadow-rose-500/30 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 border-none"
                 >
                    Use Here Instead <ArrowRight className="w-5 h-5 ml-1" />
                 </Button>
                 
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    Switching will pause the other tab
                 </p>
             </div>
        </div>
    </div>
  );
};
