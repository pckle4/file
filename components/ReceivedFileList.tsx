
import React, { useState } from 'react';
import { StoredFile } from '../types';
import { FileIcon } from './FileIcon';
import { formatFileSize, formatDate } from '../utils';
import { Download, CheckCircle2, User, Clock, X } from 'lucide-react';
import { cn } from '../utils';

interface ReceivedFileListProps {
  files: StoredFile[];
  onRemove: (id: string) => void;
}

const FileItem: React.FC<{ file: StoredFile; onRemove: (id: string) => void; }> = ({ file, onRemove }) => {
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

  return (
    <div className="w-full bg-white dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 rounded-2xl p-4 transition-all hover:shadow-md flex flex-col sm:flex-row gap-4 relative group animate-fade-in">
        <div className="flex items-start justify-center sm:justify-start">
          <FileIcon fileName={file.fileName} fileType={file.fileType} className="w-14 h-14 flex-shrink-0 shadow-sm rounded-xl" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
             <div className="flex items-start justify-between mb-1 gap-2">
                <h4 className="font-bold text-dusk-900 dark:text-white truncate text-sm leading-tight max-w-[200px] sm:max-w-none">{file.fileName}</h4>
                  <span className="hidden sm:flex px-2 py-0.5 bg-rosewood-50 dark:bg-rosewood-900/30 text-rosewood-600 dark:text-rosewood-400 rounded-full text-[10px] font-bold border border-rosewood-100 dark:border-rosewood-800 items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
             </div>
             <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-dusk-50 dark:bg-dusk-900/30 text-dusk-700 dark:text-dusk-300 rounded-lg border border-dusk-100 dark:border-dusk-800 font-bold text-sm">
                    <User className="w-4 h-4" /> 
                    <span className="truncate max-w-[120px]">{file.senderName}</span>
                    <span className="font-mono text-xs text-dusk-400 border-l border-dusk-200 dark:border-dusk-700 pl-1.5 ml-0.5">#{file.senderId.substring(0,6)}</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-lavender-50 dark:bg-dusk-800 text-dusk-600 dark:text-dusk-300 rounded font-medium text-xs">
                    <span className="font-mono">{formatFileSize(file.fileSize)}</span>
                </span>
                 <span className="flex items-center gap-1 px-2 py-1 bg-lavender-50 dark:bg-dusk-800 text-dusk-600 dark:text-dusk-300 rounded font-medium text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(file.timestamp)}</span>
                </span>
             </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:justify-center gap-2 mt-2 sm:mt-0 border-t sm:border-t-0 sm:border-l border-dusk-100 dark:border-dusk-700 pt-3 sm:pt-0 sm:pl-4 min-w-[100px]">
              <button 
                onClick={handleDownload}
                disabled={downloadStatus !== 'idle'}
                className={cn(
                  "flex-1 sm:flex-none w-full flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 rounded-xl text-xs font-bold transition-all active:scale-95",
                  downloadStatus === 'idle' && "bg-dusk-900 dark:bg-dusk-600 hover:bg-dusk-800 dark:hover:bg-dusk-700 text-white shadow-lg shadow-dusk-200 dark:shadow-none",
                  downloadStatus === 'loading' && "bg-dusk-100 dark:bg-dusk-700 text-dusk-400 cursor-wait",
                  downloadStatus === 'success' && "bg-rosewood-500 text-white shadow-rosewood-200 dark:shadow-none"
                )}
              >
                {downloadStatus === 'idle' && <><Download className="w-3.5 h-3.5" /> Download</>}
                {downloadStatus === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {downloadStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => onRemove(file.id)} className="w-full py-1.5 text-lavender-400 hover:text-dusk-600 dark:hover:text-dusk-400 hover:bg-dusk-50 dark:hover:bg-dusk-700 rounded-lg transition-colors text-xs flex items-center justify-center gap-1 hidden sm:flex">
                <X className="w-3.5 h-3.5" /> Dismiss
              </button>
              <button onClick={() => onRemove(file.id)} className="sm:hidden p-2.5 bg-dusk-50 dark:bg-dusk-700 text-dusk-400 rounded-xl border border-dusk-100 dark:border-dusk-600">
                  <X className="w-5 h-5" />
              </button>
        </div>
    </div>
  );
};

export const ReceivedFileList: React.FC<ReceivedFileListProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-col gap-4 w-full">
      {files.map((file) => <FileItem key={file.id} file={file} onRemove={onRemove} />)}
    </div>
  );
};