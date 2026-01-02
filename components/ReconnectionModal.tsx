
import React, { useState, useEffect } from 'react';
import { Wifi, X, RefreshCw, Trash2, CheckCircle2, User } from 'lucide-react';
import { cn } from '../utils';

interface ReconnectionModalProps {
  candidates: { id: string; name: string; lastSeen: number }[];
  onReconnect: (ids: string[]) => void;
  onDiscard: () => void;
}

export const ReconnectionModal: React.FC<ReconnectionModalProps> = ({ candidates, onReconnect, onDiscard }) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (candidates.length > 0) {
      setSelected(candidates.map(c => c.id));
    }
  }, [candidates]);

  if (candidates.length === 0) {
    return null;
  }

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
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-dusk-900 rounded-3xl shadow-2xl overflow-hidden border border-dusk-200 dark:border-dusk-700 animate-slide-up">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-dusk-50 to-lavender-50 dark:from-dusk-950/50 dark:to-lavender-950/50 border-b border-dusk-200 dark:border-dusk-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-11 h-11 rounded-xl bg-white dark:bg-dusk-800 border border-dusk-200 dark:border-dusk-700 flex items-center justify-center text-dusk-600 dark:text-dusk-400 relative shadow-sm">
                  <Wifi className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rosewood-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rosewood-500"></span>
                  </span>
               </div>
               <div>
                  <h3 className="font-bold text-dusk-900 dark:text-dusk-100 text-base">Session Found</h3>
                  <p className="text-xs text-lavender-500 dark:text-lavender-400 font-medium">Restore {candidates.length} peer{candidates.length !== 1 ? 's' : ''}?</p>
               </div>
            </div>
            <button onClick={onDiscard} className="text-lavender-400 hover:text-lavender-600 dark:hover:text-lavender-300 p-2 hover:bg-dusk-100 dark:hover:bg-dusk-800 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
        </div>

        {/* List */}
        <div className="p-3 max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 bg-white dark:bg-dusk-900">
           {candidates.map(peer => {
             const isSelected = selected.includes(peer.id);
             return (
              <div 
                key={peer.id}
                onClick={() => toggleSelect(peer.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 group",
                  isSelected 
                    ? "bg-dusk-50 dark:bg-dusk-950/50 border-dusk-300 dark:border-dusk-700" 
                    : "bg-dusk-50/50 dark:bg-dusk-800/50 border-transparent hover:border-dusk-200 dark:hover:border-dusk-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                    isSelected ? "bg-dusk-600 text-white" : "bg-dusk-200 dark:bg-dusk-700 text-dusk-600 dark:text-dusk-300"
                  )}>
                    {peer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={cn("font-semibold text-sm", isSelected ? "text-dusk-700 dark:text-dusk-300" : "text-dusk-700 dark:text-dusk-200")}>{peer.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-lavender-400 dark:text-lavender-500 font-mono">
                       <User className="w-3 h-3" />
                       <span>{peer.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-rosewood-500 border-rosewood-500" : "border-dusk-300 dark:border-dusk-600 group-hover:border-rosewood-400"
                )}>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
              </div>
             );
           })}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-dusk-200 dark:border-dusk-700 flex gap-2 bg-dusk-50 dark:bg-dusk-800/50">
             <button 
                onClick={onDiscard} 
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-lavender-500 dark:text-lavender-400 hover:text-lcoral-500 dark:hover:text-lcoral-400 hover:bg-lcoral-50 dark:hover:bg-lcoral-950/30 transition-colors flex items-center gap-1.5"
             >
               <Trash2 className="w-3.5 h-3.5" /> Dismiss
             </button>
             <button 
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-dusk-600 to-dusk-700 hover:from-dusk-500 hover:to-dusk-600 dark:from-dusk-500 dark:to-dusk-600 dark:hover:from-dusk-400 dark:hover:to-dusk-500 shadow-lg shadow-dusk-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <RefreshCw className="w-4 h-4" /> 
                {selected.length > 0 ? `Reconnect (${selected.length})` : 'Select Peers'}
             </button>
        </div>
      </div>
    </div>
  );
};
