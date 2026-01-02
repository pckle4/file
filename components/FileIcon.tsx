
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
    // Images - Lavender (Creative/Visual)
    if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'psd', 'ai'].includes(extension)) {
      return { icon: FileImage, color: 'text-lavender-600', bg: 'bg-lavender-50' };
    }
    // Videos - Light Coral (Media/Active)
    if (fileType.startsWith('video/') || ['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(extension)) {
      return { icon: FileVideo, color: 'text-lcoral-600', bg: 'bg-lcoral-50' };
    }
    // Audio - Bronze (Warm/Rich)
    if (fileType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
      return { icon: FileAudio, color: 'text-bronze-600', bg: 'bg-bronze-50' };
    }
    // Spreadsheets / Data - Rosewood (Structured/Important)
    if (['csv', 'xlsx', 'xls', 'numbers', 'xml'].includes(extension)) {
      return { icon: FileSpreadsheet, color: 'text-rosewood-600', bg: 'bg-rosewood-50' };
    }
    // Code / Scripts - Dusk (Technical/Deep)
    if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'rs'].includes(extension)) {
      return { icon: FileCode, color: 'text-dusk-600', bg: 'bg-dusk-50' };
    }
    // Terminal / Shell - Dusk Dark (System)
    if (['sh', 'bat', 'cmd', 'ps1'].includes(extension)) {
      return { icon: FileTerminal, color: 'text-dusk-800', bg: 'bg-dusk-100' };
    }
    // 3D / CAD - Bronze (Complex)
    if (['obj', 'stl', 'fbx', 'gltf', 'blend'].includes(extension)) {
      return { icon: FileAxis3d, color: 'text-bronze-700', bg: 'bg-bronze-50' };
    }
    // Archives - Dusk (Compressed)
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return { icon: FileArchive, color: 'text-dusk-700', bg: 'bg-dusk-100' };
    }
    // Documents - Lavender (Text/Read)
    if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(extension)) {
      return { icon: FileText, color: 'text-lavender-700', bg: 'bg-lavender-50' };
    }
    // Binary / Executables
    if (['exe', 'bin', 'dmg', 'iso'].includes(extension)) {
      return { icon: FileDigit, color: 'text-dusk-500', bg: 'bg-dusk-100' };
    }
    
    return { icon: File, color: 'text-dusk-500', bg: 'bg-dusk-100' };
  };

  const { icon: Icon, color, bg } = getIconData();

  return (
    <div className={cn("flex items-center justify-center rounded-lg", bg, color, className)}>
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
};
