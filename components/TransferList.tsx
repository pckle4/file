import React from 'react';
import { TransferItem, TransferDirection, TransferStatus } from '../types';
import { ArrowDown, ArrowUp, Loader2, Activity } from 'lucide-react';
import { formatFileSize, cn } from '../utils';
import { FileIcon } from './FileIcon';

interface TransferListProps {
  transfers: TransferItem[];
}

export const TransferList: React.FC<TransferListProps> = ({ transfers }) => {
  const activeTransfers = transfers.filter(t => t.status === TransferStatus.IN_PROGRESS || t.status === TransferStatus.PENDING);

  if (activeTransfers.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-up mb-6">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-violet-200/60 dark:border-violet-800/30 rounded-3xl p-6 shadow-2xl shadow-violet-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 animate-[shimmer_2s_infinite]" />
        
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl animate-pulse">
             <Activity className="w-5 h-5" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-white">Active File Sharing</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">{activeTransfers.length} file{activeTransfers.length !== 1 ? 's' : ''} syncing in real-time</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTransfers.map((item) => (
            <div key={item.id} className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm transition-all hover:shadow-md group">
              <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 ease-out relative overflow-hidden",
                    item.direction === TransferDirection.INCOMING ? "bg-emerald-500" : "bg-blue-500"
                  )} 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <FileIcon fileName={item.fileName} fileType={item.fileType} className="w-12 h-12 shadow-sm" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold shadow-sm",
                    item.direction === TransferDirection.INCOMING ? "bg-emerald-500" : "bg-blue-500"
                  )}>
                    {item.direction === TransferDirection.INCOMING ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate text-sm" title={item.fileName}>{item.fileName}</h4>
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      item.direction === TransferDirection.INCOMING ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                    )}>
                      {Math.round(item.progress)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatFileSize(item.fileSize)}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.status === TransferStatus.IN_PROGRESS ? (<><Loader2 className="w-3 h-3 animate-spin" /> Syncing</>) : (<>Waiting</>)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};