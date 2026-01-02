
import React from 'react';
import { X, Package, Database } from 'lucide-react';
import { formatFileSize } from '../utils';
import { FileIcon } from './FileIcon';
import { QueuedFile } from '../types';

interface QueueListProps {
  files: QueuedFile[];
  onRemove: (id: string) => void;
}

export const QueueList: React.FC<QueueListProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-up mb-4">
      <div className="bg-white dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dusk-200 via-dusk-400 to-dusk-200 dark:from-dusk-800 dark:via-dusk-600 dark:to-dusk-800 opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-dusk-100 dark:bg-dusk-800 text-dusk-600 dark:text-dusk-300 rounded-xl">
               <Package className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-dusk-900 dark:text-white">Transfer Queue</h3>
               <p className="text-xs text-dusk-500 dark:text-dusk-400">{files.length} file{files.length !== 1 ? 's' : ''} ready to send</p>
             </div>
          </div>
          
          <div className="px-3 py-1.5 bg-dusk-50 dark:bg-dusk-800 border border-dusk-100 dark:border-dusk-700 rounded-lg flex items-center gap-2">
             <Database className="w-3 h-3 text-dusk-400" />
             <span className="text-xs font-mono font-bold text-dusk-600 dark:text-dusk-300">
               {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
             </span>
          </div>
        </div>

        {/* Scrollable Grid Container */}
        <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-dusk-50 dark:bg-dusk-800/50 border border-dusk-100 dark:border-dusk-700 rounded-2xl p-3 flex items-center gap-3 transition-all hover:shadow-md hover:bg-white dark:hover:bg-dusk-800 hover:border-dusk-200 dark:hover:border-dusk-600"
              >
                <div className="relative">
                  <FileIcon fileName={item.file.name} fileType={item.file.type} className="w-10 h-10" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-lcoral-500 rounded-full border-2 border-white dark:border-dusk-800" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-dusk-700 dark:text-dusk-200 text-sm truncate" title={item.file.name}>
                    {item.file.name}
                  </div>
                  <div className="text-xs text-dusk-400 font-medium">
                    {formatFileSize(item.file.size)}
                  </div>
                </div>

                <button 
                  onClick={() => onRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-lcoral-50 dark:hover:bg-lcoral-900/20 text-dusk-400 hover:text-lcoral-500 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};