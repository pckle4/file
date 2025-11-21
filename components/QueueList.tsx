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
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
               <Package className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Transfer Queue</h3>
               <p className="text-xs text-slate-500">{files.length} file{files.length !== 1 ? 's' : ''} ready to send</p>
             </div>
          </div>
          
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
             <Database className="w-3 h-3 text-slate-400" />
             <span className="text-xs font-mono font-bold text-slate-600">
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
                className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3 transition-all hover:shadow-md hover:bg-white hover:border-slate-200"
              >
                <div className="relative">
                  <FileIcon fileName={item.file.name} fileType={item.file.type} className="w-10 h-10" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-700 text-sm truncate" title={item.file.name}>
                    {item.file.name}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {formatFileSize(item.file.size)}
                  </div>
                </div>

                <button 
                  onClick={() => onRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
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