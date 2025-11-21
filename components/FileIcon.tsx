
import React from 'react';
import { 
  File, FileText, FileImage, FileVideo, FileAudio, FileCode, FileArchive,
  FileSpreadsheet, FileAxis3d, FileTerminal, FileDigit
} from './Icons';
import { cn } from '../utils';

interface FileIconProps {
  fileName: string;
  fileType: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, fileType, className }) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const getIconData = () => {
    // Images
    if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'psd', 'ai'].includes(extension)) {
      return { icon: FileImage, color: 'text-violet-600', bg: 'bg-violet-50' };
    }
    // Videos
    if (fileType.startsWith('video/') || ['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(extension)) {
      return { icon: FileVideo, color: 'text-rose-600', bg: 'bg-rose-50' };
    }
    // Audio
    if (fileType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
      return { icon: FileAudio, color: 'text-amber-600', bg: 'bg-amber-50' };
    }
    // Spreadsheets / Data
    if (['csv', 'xlsx', 'xls', 'numbers', 'xml'].includes(extension)) {
      return { icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
    // Code / Scripts
    if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'rs'].includes(extension)) {
      return { icon: FileCode, color: 'text-blue-600', bg: 'bg-blue-50' };
    }
    // Terminal / Shell
    if (['sh', 'bat', 'cmd', 'ps1'].includes(extension)) {
      return { icon: FileTerminal, color: 'text-slate-800', bg: 'bg-slate-100' };
    }
    // 3D / CAD
    if (['obj', 'stl', 'fbx', 'gltf', 'blend'].includes(extension)) {
      return { icon: FileAxis3d, color: 'text-orange-600', bg: 'bg-orange-50' };
    }
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return { icon: FileArchive, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
    // Documents
    if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(extension)) {
      return { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' };
    }
    // Binary / Executables
    if (['exe', 'bin', 'dmg', 'iso'].includes(extension)) {
      return { icon: FileDigit, color: 'text-slate-500', bg: 'bg-slate-100' };
    }
    
    return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' };
  };

  const { icon: Icon, color, bg } = getIconData();

  return (
    <div className={cn("flex items-center justify-center rounded-lg", bg, color, className)}>
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
};
