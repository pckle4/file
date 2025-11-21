
import React, { useState } from 'react';
import { Wifi, X, RefreshCw, Trash2, User } from 'lucide-react';
import { Button } from './Button';

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 animate-pulse-slow">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Connection Restored</h2>
              <p className="text-sm text-slate-500">We found previous sessions active before the refresh.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Reconnect to Peers</h3>
          <div className="space-y-2 mb-6">
            {candidates.map(peer => (
              <div 
                key={peer.id}
                onClick={() => toggleSelect(peer.id)}
                className={`
                  flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                  ${selected.includes(peer.id) 
                    ? 'bg-violet-50 border-violet-200 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${selected.includes(peer.id) ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}
                  `}>
                    {peer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{peer.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{peer.id}</div>
                  </div>
                </div>
                
                <div className={`
                  w-5 h-5 rounded-full border flex items-center justify-center
                  ${selected.includes(peer.id) ? 'bg-violet-600 border-violet-600' : 'border-slate-300'}
                `}>
                  {selected.includes(peer.id) && <RefreshCw className="w-3 h-3 text-white" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={onDiscard}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600"
            >
              <Trash2 className="w-4 h-4" /> Ignore
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4" /> Reconnect ({selected.length})
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
