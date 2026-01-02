
import React, { useState, useEffect } from 'react';
import { SendHorizontal, X, ChevronDown, Check, Sparkles } from 'lucide-react';
import { QueuedFile, PeerInfo } from '../types';
import { Button } from './Button';
import { formatFileSize, cn } from '../utils';

interface FloatingSendBarProps {
  queue: QueuedFile[];
  peers: PeerInfo[];
  onSend: (targetPeerIds: string[]) => void;
  onClear: () => void;
}

export const FloatingSendBar: React.FC<FloatingSendBarProps> = ({ queue, peers, onSend, onClear }) => {
  const [showRecipientMenu, setShowRecipientMenu] = useState(false);
  const [selectedPeerIds, setSelectedPeerIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (queue.length > 0) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      setShowRecipientMenu(false);
    }
  }, [queue.length]);

  useEffect(() => {
    if (peers.length > 0) {
      setSelectedPeerIds(peers.map(p => p.id));
    } else {
      setSelectedPeerIds([]);
    }
  }, [peers.length]);

  if (queue.length === 0) return null;

  const totalSize = queue.reduce((acc, f) => acc + f.file.size, 0);

  const handleSendClick = () => {
    onSend(selectedPeerIds);
  };

  const togglePeerSelection = (id: string) => {
    setSelectedPeerIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedPeerIds.length === peers.length) {
      setSelectedPeerIds([]);
    } else {
      setSelectedPeerIds(peers.map(p => p.id));
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-500 ease-out will-change-transform will-change-opacity",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className="bg-gradient-to-r from-dusk-900 via-dusk-800 to-lavender-900 backdrop-blur-md text-white rounded-2xl shadow-2xl shadow-dusk-500/30 p-2 border border-lavender-700/30 flex items-center justify-between gap-3">
        
        {/* Info Section */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
           <div className="hidden xs:flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-lcoral-400 to-rosewood-500 text-white shadow-lg shrink-0">
             <Sparkles className="w-5 h-5" />
           </div>
           
           <div className="flex flex-col justify-center min-w-0">
             <div className="flex items-center gap-2">
               <span className="font-bold text-sm whitespace-nowrap text-bronze-200">{queue.length} File{queue.length > 1 ? 's' : ''}</span>
               <span className="w-1 h-1 rounded-full bg-rosewood-400" />
               <span className="text-xs text-lavender-300 font-mono">{formatFileSize(totalSize)}</span>
             </div>
             
             {peers.length > 1 ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowRecipientMenu(!showRecipientMenu)}
                    className="flex items-center gap-1 text-xs font-medium text-lavender-300 hover:text-bronze-200 transition-colors"
                  >
                    To: {selectedPeerIds.length === peers.length ? 'Everyone' : `${selectedPeerIds.length} Peers`}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showRecipientMenu && (
                    <div className="absolute bottom-full left-0 mb-3 w-48 bg-dusk-800 rounded-xl shadow-xl border border-lavender-700/50 p-1 text-white animate-fade-in overflow-hidden z-20">
                      <div 
                        onClick={toggleSelectAll}
                        className="px-3 py-2 hover:bg-lavender-700/30 rounded-lg cursor-pointer flex items-center justify-between text-xs font-bold border-b border-lavender-700/50 mb-1"
                      >
                        <span>Select All</span>
                        {selectedPeerIds.length === peers.length && <Check className="w-3 h-3 text-bronze-400" />}
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {peers.map(peer => (
                          <div 
                            key={peer.id}
                            onClick={() => togglePeerSelection(peer.id)}
                            className="px-3 py-2 hover:bg-lavender-700/30 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                          >
                            <span className="truncate mr-2 text-dusk-200">{peer.name}</span>
                            {selectedPeerIds.includes(peer.id) && <Check className="w-3 h-3 text-bronze-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             ) : (
                <span className="text-xs text-lavender-400 truncate max-w-[100px] sm:max-w-none block">
                   To: <span className="text-bronze-300">{peers.length === 1 ? peers[0].name : '...'}</span>
                </span>
             )}
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onClear}
            className="p-2 rounded-xl hover:bg-rosewood-600/20 text-dusk-300 hover:text-rosewood-400 transition-colors"
            title="Clear Queue"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSendClick}
            disabled={selectedPeerIds.length === 0}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-sm transition-all",
              "bg-gradient-to-r from-lcoral-500 to-rosewood-500 text-white",
              "hover:from-lcoral-400 hover:to-rosewood-400 hover:shadow-lg hover:shadow-lcoral-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <SendHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline">Send</span>
          </button>
        </div>

      </div>
      {showRecipientMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowRecipientMenu(false)} />
      )}
    </div>
  );
};
