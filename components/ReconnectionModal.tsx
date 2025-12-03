
import React, { useState } from 'react';
import { Wifi, X, RefreshCw, Trash2, CheckCircle2, User } from 'lucide-react';
import { cn } from '../utils';

interface ReconnectionModalProps {
  candidates: { id: string; name: string; lastSeen: number }[];
  onReconnect: (ids: string[]) => void;
  onDiscard: () => void;
}

export const ReconnectionModal: React.FC<ReconnectionModalProps> = ({ candidates, onReconnect, onDiscard }) => {
  const [selected, setSelected] = useState<string[]>(candidates.map(c => c.id));

  if (candidates.length === 0) return null;

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(pid => pid !== id));
    } else {
      setSelected(prev => [...prev, id]);
    }
  };

  const handleConfirm = () => {
    onReconnect(selected);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#111] rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-slide-up ring-1 ring-black/5">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-slate-50 dark:bg-[#151515] border-b border-slate-100 dark:border-white/5 flex items-start justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 relative">
                  <Wifi className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Session Found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Restore {candidates.length} previous peer{candidates.length !== 1 ? 's' : ''}?</p>
               </div>
            </div>
            <button onClick={onDiscard} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* List */}
        <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 bg-white dark:bg-[#111]">
           {candidates.map(peer => {
             const isSelected = selected.includes(peer.id);
             return (
              <div 
                key={peer.id}
                onClick={() => toggleSelect(peer.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 group relative overflow-hidden",
                  isSelected 
                    ? "bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-500/30" 
                    : "bg-slate-50/50 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors shadow-sm",
                    isSelected ? "bg-violet-600 text-white" : "bg-white dark:bg-neutral-800 text-slate-500 dark:text-slate-400"
                  )}>
                    {peer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={cn("font-bold text-sm", isSelected ? "text-violet-900 dark:text-violet-100" : "text-slate-700 dark:text-slate-200")}>{peer.name}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                       <User className="w-3 h-3" />
                       <span className="font-mono">{peer.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10",
                  isSelected ? "bg-violet-600 border-violet-600 scale-100" : "border-slate-300 dark:border-neutral-600 scale-90 group-hover:border-violet-400 bg-white dark:bg-transparent"
                )}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
             );
           })}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5 flex gap-3 bg-slate-50/50 dark:bg-[#151515]">
             <button 
                onClick={onDiscard} 
                className="px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
             >
               <Trash2 className="w-4 h-4" /> Dismiss
             </button>
             <button 
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-700 shadow-lg shadow-slate-900/10 dark:shadow-violet-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <RefreshCw className="w-4 h-4" /> 
                {selected.length > 0 ? `Reconnect (${selected.length})` : 'Select Peers'}
             </button>
        </div>
      </div>
    </div>
  );
};
