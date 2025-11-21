
export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export enum TransferDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export enum TransferStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface PeerInfo {
  id: string;
  name: string;
  os: string;
  browser: string;
  connectedAt: number;
  isSecure?: boolean;
}

export interface QueuedFile {
  id: string;
  file: File;
  addedAt: number;
  status: 'ready' | 'sending' | 'sent';
}

export interface TransferItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  progress: number;
  direction: TransferDirection;
  status: TransferStatus;
  timestamp: number;
  startTime: number;
  endTime?: number;
  peerId?: string;
  error?: string;
}

export interface StoredFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  blob: Blob;
  senderName: string;
  senderId: string;
  timestamp: number;
  expiresAt: number;
}

export interface SentFileLog {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  recipientId: string;
  timestamp: number;
  status: TransferStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer' | 'system';
  peerId?: string;
  senderName?: string;
  text?: string;
  timestamp: number;
  attachment?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    transferId: string;
  };
}

export interface AppSettings {
  autoDownload: boolean;
  chunkSize: number;
  maxPeers: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export type ProtocolMessage = 
  | { type: 'HANDSHAKE'; peerInfo: PeerInfo }
  | { type: 'METADATA'; transferId: string; fileName: string; fileSize: number; fileType: string }
  | { type: 'CHUNK'; transferId: string; data: ArrayBuffer; chunkIndex?: number }
  | { type: 'END'; transferId: string }
  | { type: 'CHAT'; text?: string; id: string; timestamp: number; attachment?: ChatMessage['attachment']; senderName?: string };