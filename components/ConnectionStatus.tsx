import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PeerInfo } from '../types';
import { ChevronDown, Wifi, Shield, LogOut, Zap } from './Icons';
import { cn } from '../utils';

interface ConnectionStatusProps {
  peers: PeerInfo[];
  onDisconnect: (peerId: string) => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ peers, onDisconnect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (peers.length === 0) return null;

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto mb-6 relative z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className={cn(
        "bg-white/90 dark:bg-dusk-900/90 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 group",
        isExpanded 
          ? "shadow-elevated border-dusk-300 dark:border-dusk-700" 
          : "shadow-lg shadow-dusk-200/50 dark:shadow-black/20 border-white/60 dark:border-dusk-800"
      )}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="w-full px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-dusk-50/50 dark:hover:bg-dusk-800/30 transition-colors outline-none"
        >
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Animated connection indicator */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              >
                <Wifi className="w-8 h-8 text-lcoral-500" />
              </motion.div>
              <motion.div 
                className="absolute -top-2 -right-2 w-3 h-3 bg-lcoral-500 rounded-full shadow-glow-lcoral"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 bg-lcoral-400/20 rounded-full blur-xl" />
            </div>
            
            <div className="text-left">
              <h3 className="text-lg font-bold text-dusk-900 dark:text-white flex items-center gap-2 tracking-tight">
                {peers.length} Active Peer{peers.length !== 1 && 's'}
              </h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap",
                  "bg-dusk-50 dark:bg-dusk-900/30 text-dusk-700 dark:text-dusk-400",
                  "border border-dusk-100 dark:border-dusk-800"
                )}>
                  <Shield className="w-3 h-3 fill-dusk-700 dark:fill-dusk-400" />
                  Encrypted
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            {/* Peer avatars */}
            <div className="flex -space-x-3 pl-2">
              {peers.slice(0, 4).map((peer, i) => (
                <motion.div 
                  key={peer.id} 
                  className={cn(
                    "w-10 h-10 rounded-full ring-4 ring-white dark:ring-dusk-900",
                    "flex items-center justify-center text-xs font-bold text-white shadow-md",
                    "transition-transform hover:z-10 relative overflow-hidden",
                    i % 2 === 0 
                      ? "bg-gradient-to-br from-dusk-600 to-dusk-700" 
                      : "bg-gradient-to-br from-lcoral-500 to-rosewood-600"
                  )}
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="relative z-10">{peer.name.charAt(0).toUpperCase()}</span>
                </motion.div>
              ))}
              {peers.length > 4 && (
                <div className="w-10 h-10 rounded-full ring-4 ring-white dark:ring-dusk-900 bg-dusk-100 dark:bg-dusk-800 flex items-center justify-center text-xs font-bold text-lavender-500 dark:text-lavender-300">
                  +{peers.length - 4}
                </div>
              )}
            </div>
            
            <div className="w-px h-8 bg-dusk-200 dark:bg-dusk-800 mx-2 hidden sm:block" />
            
            {/* Expand button */}
            <motion.div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-auto md:ml-0",
                isExpanded 
                  ? "bg-dusk-100 dark:bg-dusk-800 text-dusk-600 dark:text-dusk-300" 
                  : "text-lavender-400 hover:bg-dusk-50 dark:hover:bg-dusk-800"
              )}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </button>
        
        {/* Expandable peer list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="overflow-hidden border-t border-dusk-100 dark:border-dusk-800"
            >
              <div className="p-6 bg-dusk-50/50 dark:bg-transparent">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {peers.map((peer, index) => (
                    <motion.div 
                      key={peer.id} 
                      className={cn(
                        "bg-white dark:bg-dusk-900 p-4 rounded-2xl",
                        "border border-dusk-200 dark:border-dusk-800",
                        "shadow-sm flex items-center justify-between gap-4",
                        "hover:border-lavender-300 dark:hover:border-lavender-700",
                        "transition-colors group/peer"
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          "text-white font-bold text-lg shadow-lg flex-shrink-0",
                          "bg-gradient-to-br from-dusk-600 to-lavender-700"
                        )}>
                          {peer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <div className="text-sm font-bold text-dusk-900 dark:text-white truncate">
                            {peer.name}
                          </div>
                          <div className="text-lg font-mono font-bold text-lavender-500 dark:text-lavender-400 tracking-widest truncate flex items-center gap-1.5">
                            {peer.id}
                            <motion.div 
                              className="w-1.5 h-1.5 rounded-full bg-lcoral-500"
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <motion.button 
                        onClick={(e) => { e.stopPropagation(); onDisconnect(peer.id); }} 
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-xl",
                          "bg-dusk-50 dark:bg-dusk-800",
                          "text-lavender-400",
                          "border border-dusk-100 dark:border-dusk-700",
                          "transition-colors",
                          "hover:bg-rosewood-50 dark:hover:bg-rosewood-900/30",
                          "hover:text-rosewood-500 hover:border-rosewood-100 dark:hover:border-rosewood-800"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogOut className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="px-6 pt-6 flex justify-center">
                  <motion.div 
                    className={cn(
                      "inline-flex items-center gap-2 text-[10px] font-medium",
                      "text-lavender-400 bg-white dark:bg-dusk-900",
                      "px-4 py-1.5 rounded-full",
                      "border border-dusk-200 dark:border-dusk-800 shadow-sm"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Zap className="w-3 h-3 text-bronze-500" />
                    Real-time low latency connection active
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
