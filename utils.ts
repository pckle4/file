import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generatePeerId = (): string => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getSystemInfo = () => {
  const userAgent = navigator.userAgent;
  let os = "Unknown OS";
  if (userAgent.indexOf("Win") !== -1) os = "Windows";
  if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
  if (userAgent.indexOf("Linux") !== -1) os = "Linux";
  if (userAgent.indexOf("Android") !== -1) os = "Android";
  if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

  let browser = "Unknown Browser";
  if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
  else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
  else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
  else if (userAgent.indexOf("Edge") !== -1) browser = "Edge";

  return { os, browser };
};

export const formatTimeLeft = (expiryTimestamp: number): string => {
  const diff = expiryTimestamp - Date.now();
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const CHUNK_SIZE = 16 * 1024;

interface SavedPeer {
  id: string;
  name: string;
  lastSeen: number;
}

const RECENT_PEERS_KEY = 'nw_recent_peers';

export const getRecentPeers = (): SavedPeer[] => {
  try {
    const stored = localStorage.getItem(RECENT_PEERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const addRecentPeer = (id: string, name: string) => {
  try {
    const peers = getRecentPeers();
    const filtered = peers.filter(p => p.id !== id);
    filtered.push({ id, name, lastSeen: Date.now() });
    localStorage.setItem(RECENT_PEERS_KEY, JSON.stringify(filtered));
  } catch (e) {}
};

export const removeRecentPeer = (id: string) => {
  try {
    const peers = getRecentPeers();
    const filtered = peers.filter(p => p.id !== id);
    localStorage.setItem(RECENT_PEERS_KEY, JSON.stringify(filtered));
  } catch (e) {}
};

export const clearRecentPeers = () => {
  localStorage.removeItem(RECENT_PEERS_KEY);
};