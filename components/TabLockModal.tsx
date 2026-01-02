
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';

interface TabLockModalProps {
  onTakeover: () => void;
}

export const TabLockModal: React.FC<TabLockModalProps> = ({ onTakeover }) => {
  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center p-4 bg-dusk-900/80 backdrop-blur-sm animate-fade-in rounded-3xl">
        <div className="bg-white dark:bg-dusk-950 border border-dusk-200 dark:border-dusk-800 w-full h-full flex flex-col items-center justify-center p-6 text-center animate-slide-up relative overflow-hidden rounded-2xl">
             {/* Decorative elements */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lcoral-500 via-rosewood-500 to-lcoral-500" />
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-rosewood-500/10 rounded-full blur-2xl pointer-events-none" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-lavender-500/10 rounded-full blur-2xl pointer-events-none" />
             
             <div className="mx-auto w-16 h-16 bg-rosewood-50 dark:bg-rosewood-900/20 rounded-full flex items-center justify-center mb-4 relative border border-rosewood-100 dark:border-rosewood-900/30 shadow-inner">
                <Lock className="w-8 h-8 text-rosewood-500" />
             </div>

             <h2 className="text-xl font-black text-dusk-900 dark:text-white mb-2 tracking-tight">Session Paused</h2>
             <p className="text-dusk-500 dark:text-dusk-400 mb-6 leading-relaxed text-xs font-medium max-w-[240px]">
                Connection active in another tab. Use that tab or take control here.
             </p>

             <div className="space-y-3 relative z-10 w-full max-w-[200px]">
                 <Button 
                   onClick={onTakeover} 
                   size="sm"
                   className="w-full py-3 text-sm font-bold shadow-lg shadow-rosewood-500/20 hover:shadow-rosewood-500/30 rounded-xl bg-dusk-900 dark:bg-white text-white dark:text-dusk-900 hover:bg-dusk-800 dark:hover:bg-dusk-100 border-none"
                 >
                    Use Here Instead
                 </Button>
             </div>
        </div>
    </div>
  );
};
