import React from 'react';
import { PeerInfo } from '../types';
import { 
  Laptop, Smartphone, Monitor, Clock, Zap, LogOut, Users, CheckCircle2, Send, ArrowRightLeft
} from './Icons';
import { Button } from './Button';

interface PeerListProps {
  peers: PeerInfo[];
  onDisconnect: (id: string) => void;
  onSendFile: (id: string) => void;
  transferCounts: Record<string, number>;
}

const getDeviceIcon = (os: string) => {
  const lowerOS = os.toLowerCase();
  if (lowerOS.includes('android') || lowerOS.includes('ios') || lowerOS.includes('iphone')) return Smartphone;
  if (lowerOS.includes('mac') || lowerOS.includes('win') || lowerOS.includes('linux')) return Laptop;
  return Monitor;
};

export const PeerList: React.FC<PeerListProps> = ({ peers, onDisconnect, onSendFile, transferCounts }) => {
  if (peers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 opacity-50" />
        </div>
        <p className="font-medium">No active peer connections</p>
        <p className="text-xs mt-1">Connect using the panel above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
      {peers.map((peer) => {
        const DeviceIcon = getDeviceIcon(peer.os);
        const connectionDate = new Date(peer.connectedAt);
        const transferCount = transferCounts[peer.id] || 0;
        
        return (
          <div key={peer.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-700 dark:to-transparent rounded-bl-[100px] -mr-10 -mt-10 opacity-80 pointer-events-none" />
            <div className="flex justify-between items-start relative z-10 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-slate-900/20 border-2 border-slate-100 dark:border-slate-600">
                  {peer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                   <h3 className="font-black text-slate-900 dark:text-white text-lg truncate">{peer.name}</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">{peer.id}</span>
                   </div>
                </div>
              </div>
              <button onClick={() => onDisconnect(peer.id)} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-100 dark:hover:border-red-800">
                  <LogOut className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Stable</span>
               </div>
               <div className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Connected</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider"><DeviceIcon className="w-3.5 h-3.5" /> OS/Device</div>
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{peer.os} / {peer.browser}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider"><ArrowRightLeft className="w-3.5 h-3.5" /> Transfers</div>
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{transferCount} Files</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                   <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> Connected Since</div>
                   <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{connectionDate.toLocaleTimeString()}</span>
                </div>
            </div>
            <div className="mt-auto relative z-10">
               <Button onClick={() => onSendFile(peer.id)} className="w-full py-3 text-sm shadow-sm bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-700 text-white rounded-xl">
                  <Send className="w-4 h-4" /> Send File
               </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};