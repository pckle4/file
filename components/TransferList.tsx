
import React from 'react';
import { TransferItem, TransferDirection, TransferStatus } from '../types';
import { ArrowDown, ArrowUp, Loader2, Activity, Users } from 'lucide-react';
import { formatFileSize, cn } from '../utils';
import { FileIcon } from './FileIcon';

interface TransferListProps {
  transfers: TransferItem[];
}

export const TransferList: React.FC<TransferListProps> = ({ transfers }) => {
  const activeTransfers = transfers.filter(t => t.status === TransferStatus.IN_PROGRESS || t.status === TransferStatus.PENDING);

  if (activeTransfers.length === 0) return null;

  // Group by GroupID for Outgoing, keep individual for Incoming
  const groupedTransfers: { [key: string]: TransferItem[] } = {};
  const displayItems: { item: TransferItem, isGroup: boolean, peers: string[] }[] = [];

  // 1. Sort into groups or single items
  activeTransfers.forEach(t => {
      if (t.direction === TransferDirection.OUTGOING && t.groupId) {
          if (!groupedTransfers[t.groupId]) {
              groupedTransfers[t.groupId] = [];
          }
          groupedTransfers[t.groupId].push(t);
      } else {
          // Incoming or single outgoing without group ID
          displayItems.push({ item: t, isGroup: false, peers: [t.peerId || 'Unknown'] });
      }
  });

  // 2. Process groups into single display items
  Object.keys(groupedTransfers).forEach(groupId => {
      const items = groupedTransfers[groupId];
      if (items.length > 0) {
          // Calculate aggregate progress
          const totalProgress = items.reduce((acc, curr) => acc + curr.progress, 0);
          const avgProgress = totalProgress / items.length;
          const peers = items.map(i => i.peerId || '?');
          
          // Create a representative item
          const repItem = { ...items[0], progress: avgProgress };
          displayItems.push({ item: repItem, isGroup: true, peers });
      }
  });

  // 3. Sort by start time descending
  displayItems.sort((a, b) => b.item.startTime - a.item.startTime);

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-up mb-6">
      <div className="bg-white/90 dark:bg-dusk-900/90 backdrop-blur-xl border border-dusk-200/60 dark:border-dusk-800/30 rounded-3xl p-6 shadow-2xl shadow-dusk-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dusk-500 via-lavender-500 to-dusk-500 animate-[shimmer_2s_infinite]" />
        
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-dusk-100 dark:bg-dusk-900/30 text-dusk-600 dark:text-dusk-400 rounded-xl animate-pulse">
             <Activity className="w-5 h-5" />
           </div>
           <div>
             <h3 className="font-bold text-dusk-900 dark:text-white">Active File Sharing</h3>
             <p className="text-xs text-lavender-500 dark:text-lavender-400">{activeTransfers.length} transfer{activeTransfers.length !== 1 ? 's' : ''} syncing in real-time</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayItems.map(({ item, isGroup, peers }) => (
            <div key={item.id} className="relative overflow-hidden bg-white dark:bg-dusk-950 border border-dusk-200 dark:border-dusk-800 rounded-2xl p-4 shadow-sm transition-all hover:shadow-md group">
              <div className="absolute bottom-0 left-0 h-1 bg-dusk-50 dark:bg-dusk-900 w-full">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 ease-out relative overflow-hidden",
                    item.direction === TransferDirection.INCOMING ? "bg-lcoral-500" : "bg-dusk-500"
                  )} 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <FileIcon fileName={item.fileName} fileType={item.fileType} className="w-12 h-12 shadow-sm" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-dusk-950 flex items-center justify-center text-[10px] text-white font-bold shadow-sm",
                    item.direction === TransferDirection.INCOMING ? "bg-lcoral-500" : "bg-dusk-500"
                  )}>
                    {item.direction === TransferDirection.INCOMING ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-dusk-900 dark:text-white truncate text-sm" title={item.fileName}>{item.fileName}</h4>
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      item.direction === TransferDirection.INCOMING ? "text-lcoral-600 dark:text-lcoral-400" : "text-dusk-600 dark:text-dusk-400"
                    )}>
                      {Math.round(item.progress)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-lavender-500 dark:text-lavender-400 font-medium">{formatFileSize(item.fileSize)}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-dusk-400">
                      {isGroup ? (
                          <span className="flex items-center gap-1 text-dusk-500">
                             <Users className="w-3 h-3" /> {peers.length} Peers
                          </span>
                      ) : (
                          item.status === TransferStatus.IN_PROGRESS ? (<><Loader2 className="w-3 h-3 animate-spin" /> Syncing</>) : (<>Waiting</>)
                      )}
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
