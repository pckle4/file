
import React, { useState, useEffect } from 'react';
import { Send, X, ChevronDown, Check, Layers } from 'lucide-react';
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

  // Handle mount animation smoothly
  useEffect(() => {
    if (queue.length > 0) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      setShowRecipientMenu(false);
    }
  }, [queue.length]);

  // Initialize selected peers when peer list changes
  useEffect(() => {
    if (peers.length > 0) {
      setSelectedPeerIds(peers.map(p => p.id)); // Default to all
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
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6 transition-all duration-500 ease-out will-change-transform will-change-opacity",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className="bg-[#111]/95 backdrop-blur-md text-white rounded-full shadow-2xl shadow-black/40 p-2 pl-4 border border-white/10 flex items-center justify-between gap-4">
        
        {/* Info Section */}
        <div className="flex items-center gap-4 min-w-0">
           <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-lg shadow-white/20 shrink-0">
             <Layers className="w-5 h-5" />
           </div>
           
           <div className="flex flex-col justify-center min-w-0">
             <div className="flex items-center gap-2">
               <span className="font-bold text-sm whitespace-nowrap">{queue.length} File{queue.length > 1 ? 's' : ''} Ready</span>
               <span className="w-1 h-1 rounded-full bg-neutral-500" />
               <span className="text-xs text-neutral-400 font-mono">{formatFileSize(totalSize)}</span>
             </div>
             
             {peers.length > 1 ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowRecipientMenu(!showRecipientMenu)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    To: {selectedPeerIds.length === peers.length ? 'Everyone' : `${selectedPeerIds.length} Peers`}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {/* Recipient Menu */}
                  {showRecipientMenu && (
                    <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#222] rounded-xl shadow-xl border border-white/10 p-1 text-white animate-fade-in overflow-hidden">
                      <div 
                        onClick={toggleSelectAll}
                        className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer flex items-center justify-between text-xs font-bold border-b border-white/10 mb-1"
                      >
                        <span>Select All</span>
                        {selectedPeerIds.length === peers.length && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      {/* Added max-height and scrollbar for peer list */}
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {peers.map(peer => (
                          <div 
                            key={peer.id}
                            onClick={() => togglePeerSelection(peer.id)}
                            className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                          >
                            <span className="truncate mr-2 text-neutral-300">{peer.name}</span>
                            {selectedPeerIds.includes(peer.id) && <Check className="w-3 h-3 text-emerald-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             ) : (
                <span className="text-xs text-neutral-500 truncate">
                   To: <span className="text-neutral-300">{peers.length === 1 ? peers[0].name : '...'}</span>
                </span>
             )}
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onClear}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
            title="Clear Queue"
          >
            <X className="w-5 h-5" />
          </button>
          <Button 
            onClick={handleSendClick}
            disabled={selectedPeerIds.length === 0}
            className="rounded-full px-6 py-2.5 font-bold bg-white text-black hover:bg-neutral-200 border-none shadow-none gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>

      </div>
      {/* Overlay to close menu */}
      {showRecipientMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowRecipientMenu(false)} />
      )}
    </div>
  );
};
