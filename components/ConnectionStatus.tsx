import React, { useState } from 'react';
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
    <div className="w-full max-w-6xl mx-auto mb-6 relative z-30 animate-slide-up">
      <div className={cn("bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 group", isExpanded ? "shadow-2xl shadow-slate-900/5 dark:shadow-black/30 border-slate-300 dark:border-neutral-700" : "shadow-lg shadow-slate-200/50 dark:shadow-black/20 border-white/60 dark:border-neutral-800")}>
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors outline-none">
          <div className="flex items-center gap-5 w-full md:w-auto">
             <div className="relative flex-shrink-0">
                <Wifi className="w-8 h-8 text-emerald-500" />
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
             </div>
            <div className="text-left">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">{peers.length} Active Peer{peers.length !== 1 && 's'}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                 <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap"><Shield className="w-3 h-3 fill-emerald-700 dark:fill-emerald-400" /> Encrypted</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <div className="flex -space-x-3 pl-2">
              {peers.slice(0, 4).map((peer, i) => (
                  <div key={peer.id} className={cn("w-10 h-10 rounded-full ring-4 ring-white dark:ring-[#111] flex items-center justify-center text-xs font-bold text-white shadow-md transition-transform hover:scale-110 hover:z-10 relative overflow-hidden", i % 2 === 0 ? "bg-slate-900" : "bg-slate-700")}>
                    <span className="relative z-10">{peer.name.charAt(0).toUpperCase()}</span>
                  </div>
              ))}
              {peers.length > 4 && (
                  <div className="w-10 h-10 rounded-full ring-4 ring-white dark:ring-[#111] bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300">+{peers.length - 4}</div>
              )}
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800 mx-2 hidden sm:block" />
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ml-auto md:ml-0", isExpanded ? "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 rotate-180" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800")}>
               <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </button>
        <div className={cn("grid transition-all duration-300 ease-in-out border-slate-100 dark:border-neutral-800 will-change-[grid-template-rows]", isExpanded ? "grid-rows-1 border-t opacity-100" : "grid-rows-0 border-t-0 opacity-0")}>
            <div className="overflow-hidden bg-slate-50/50 dark:bg-transparent">
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                   {peers.map(peer => (
                      <div key={peer.id} className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-neutral-700 transition-all">
                         <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-neutral-800 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-900/20 dark:shadow-black/40 flex-shrink-0">{peer.name.charAt(0).toUpperCase()}</div>
                            <div className="min-w-0 flex flex-col">
                               <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{peer.name}</div>
                               <div className="text-lg font-mono font-black text-slate-700 dark:text-slate-400 tracking-widest truncate flex items-center gap-1.5">{peer.id}<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /></div>
                            </div>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); onDisconnect(peer.id); }} className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-90 border border-slate-100 dark:border-neutral-700 hover:border-red-100 dark:hover:border-red-800"><LogOut className="w-4 h-4" /></button>
                      </div>
                   ))}
                </div>
                <div className="px-6 pb-4 flex justify-center">
                   <div className="inline-flex items-center gap-2 text-[10px] text-slate-400 bg-white dark:bg-neutral-900 px-4 py-1.5 rounded-full border border-slate-200 dark:border-neutral-800 shadow-sm font-medium"><Zap className="w-3 h-3 text-amber-500" /> Real-time low latency connection active</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};