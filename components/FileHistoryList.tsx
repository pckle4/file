
import React, { useState } from 'react';
import { StoredFile } from '../types';
import { FileIcon } from './FileIcon';
import { formatFileSize, formatDate } from '../utils';
import { Download, Trash2, Clock, CheckCircle2, User, File as FileIconLucide, Calendar, Loader2 } from 'lucide-react';
import { cn } from '../utils';

interface FileHistoryListProps {
  files: StoredFile[];
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<{ 
  file: StoredFile; 
  onDelete: (id: string) => void; 
}> = ({ file, onDelete }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleDownload = () => {
    setDownloadStatus('loading');
    setTimeout(() => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    }, 600);
  };

  // Format expiration date absolutely
  const expirationDate = new Date(file.expiresAt);
  const formattedExpiry = expirationDate.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-3 last:mb-0 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all animate-fade-in relative overflow-hidden">
        {/* Expiration Indicator Strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />

        <div className="flex items-start justify-center sm:justify-start pl-2">
          <FileIcon fileName={file.fileName} fileType={file.fileType} className="w-12 h-12 flex-shrink-0 rounded-xl shadow-sm" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
             <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm" title={file.fileName}>{file.fileName}</h4>
             <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-md text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-600">
               {formatFileSize(file.fileSize)}
             </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
             <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-bold">
                <User className="w-4 h-4 text-slate-400" />
                <span className="truncate">From: {file.senderName}</span>
                <span className="font-mono text-xs text-slate-400 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">#{file.senderId.substring(0,6)}</span>
             </div>
             
             <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded w-fit">
                <Clock className="w-3 h-3" />
                <span>Expires: {formattedExpiry}</span>
             </div>
             
             <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>Rec: {formatDate(file.timestamp)}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-4 mt-1 sm:mt-0">
             <button 
                onClick={handleDownload}
                disabled={downloadStatus !== 'idle'}
                className={cn(
                  "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95",
                  downloadStatus === 'idle' ? "bg-slate-900 dark:bg-violet-600 text-white hover:bg-slate-800 dark:hover:bg-violet-700 hover:shadow-md" :
                  downloadStatus === 'loading' ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-wait" :
                  "bg-emerald-500 text-white shadow-emerald-500/20"
                )}
             >
                {downloadStatus === 'idle' && <Download className="w-4 h-4" />}
                {downloadStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {downloadStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{downloadStatus === 'success' ? 'Saved' : 'Download'}</span>
             </button>
             
             <button 
               onClick={() => onDelete(file.id)}
               className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
               title="Remove from history"
             >
               <Trash2 className="w-5 h-5" />
             </button>
        </div>
    </div>
  );
};

export const FileHistoryList: React.FC<FileHistoryListProps> = ({ files, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
           <Clock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No file history</p>
        <p className="text-sm mt-1 opacity-80">Files received will appear here for 24 hours</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="space-y-1">
        {files.map((file) => (
          <HistoryItem 
            key={file.id} 
            file={file} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};
