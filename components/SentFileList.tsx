import React from 'react';
import { SentFileLog, TransferStatus } from '../types';
import { FileIcon } from './FileIcon';
import { formatFileSize, formatDate } from '../utils';
import { Check, AlertCircle, User, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils';

interface SentFileListProps {
  files: SentFileLog[];
}

export const SentFileList: React.FC<SentFileListProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {files.map((file) => (
        <div key={file.id} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all">
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <FileIcon fileName={file.fileName} fileType={file.fileType} className="w-12 h-12 flex-shrink-0 rounded-xl shadow-sm" />
              <div className="sm:hidden flex-1 min-w-0">
                 <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm mb-1">{file.fileName}</h4>
                 <span className={cn(
                   "text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 uppercase tracking-wider",
                   file.status === TransferStatus.COMPLETED ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                 )}>
                    {file.status === TransferStatus.COMPLETED ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {file.status === TransferStatus.COMPLETED ? 'Sent' : 'Failed'}
                 </span>
              </div>
           </div>
           <div className="flex-1 min-w-0 w-full">
              <div className="hidden sm:flex items-center justify-between mb-2">
                 <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{file.fileName}</h4>
                 <span className={cn(
                   "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider",
                   file.status === TransferStatus.COMPLETED ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                 )}>
                    {file.status === TransferStatus.COMPLETED ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {file.status === TransferStatus.COMPLETED ? 'Sent' : 'Failed'}
                 </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                 <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-600">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatFileSize(file.fileSize)}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                    <span>{formatDate(file.timestamp)}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>To: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{file.recipientId.substring(0,6)}</span></span>
                 </div>
              </div>
           </div>
           <div className="hidden sm:flex items-center justify-center h-full pl-4 border-l border-slate-100 dark:border-slate-700">
              <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-400">
                 <ArrowUpRight className="w-5 h-5" />
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};