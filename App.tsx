import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import LogoIcon from './llogoo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { peerService } from './services/peerService';
import { 
  generatePeerId, 
  cn, 
  getSystemInfo, 
  getRecentPeers, 
  addRecentPeer, 
  removeRecentPeer, 
  clearRecentPeers,
  formatFileSize
} from './utils';
import { saveFile, getFiles, deleteFile, pruneExpiredFiles } from './services/db';
import { 
  ConnectionState, 
  TransferItem, 
  TransferDirection, 
  TransferStatus, 
  ProtocolMessage,
  PeerInfo,
  AppSettings,
  StoredFile,
  SentFileLog,
  QueuedFile,
  ToastNotification,
  ChatMessage
} from './types';
import { 
  Users,
  PieChart,
  HardDrive,
  Scan,
  Cloud,
  Key,
  MousePointer2,
  Plus,
  ArrowRight,
  Loader2,
  History,
  Send,
  MessageSquare,
  Copy,
  Check,
  User,
  RefreshCw,
  Activity,
  Globe,
  TrendingUp,
  Scale,
  Award,
  Zap,
  Leaf,
  Sparkles,
  Gem,
  Wind
} from './components/Icons';
import { Button } from './components/Button';
import { TransferList } from './components/TransferList';
import { ReceivedFileList } from './components/ReceivedFileList';
import { SentFileList } from './components/SentFileList';
import { QueueList } from './components/QueueList';
import { ToastContainer } from './components/Toast';
import { ConnectionStatus } from './components/ConnectionStatus';
import { PeerList } from './components/PeerList';
import { FloatingSendBar } from './components/FloatingSendBar';
import { Footer } from './components/Footer';
import { Tabs, TabItem } from './components/Tabs';
import { FileHistoryList } from './components/FileHistoryList';

// Lazy load heavy components
const CreateFileModal = React.lazy(() => import('./components/CreateFileModal').then(m => ({ default: m.CreateFileModal })));
const SettingsBubble = React.lazy(() => import('./components/SettingsBubble').then(m => ({ default: m.SettingsBubble })));
const OnboardingModal = React.lazy(() => import('./components/OnboardingModal').then(m => ({ default: m.OnboardingModal })));
const StorageTab = React.lazy(() => import('./components/StorageTab').then(m => ({ default: m.StorageTab })));
const ReconnectionModal = React.lazy(() => import('./components/ReconnectionModal').then(m => ({ default: m.ReconnectionModal })));
const ChatTab = React.lazy(() => import('./components/ChatTab').then(m => ({ default: m.ChatTab })));
const TabLockModal = React.lazy(() => import('./components/TabLockModal').then(m => ({ default: m.TabLockModal })));

// Import Pages
const TechPage = React.lazy(() => import('./components/TechPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const InfoPage = React.lazy(() => import('./components/InfoPage'));
const HowToPage = React.lazy(() => import('./components/HowToPage'));

import MagicLoader from './components/MagicLoader';

interface IncomingFileBuffer {
  chunks: ArrayBuffer[];
  receivedSize: number;
  metadata: ProtocolMessage & { type: 'METADATA' };
  startTime: number;
  senderName?: string;
}

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [myId, setMyId] = useState<string>('');
  const [myName, setMyName] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isRegeneratingId, setIsRegeneratingId] = useState(false);

  const [remoteIdInput, setRemoteIdInput] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState<PeerInfo[]>([]);
  
  const [reconnectCandidates, setReconnectCandidates] = useState<{id: string, name: string, lastSeen: number}[]>([]);
  
  const [activeTransfers, setActiveTransfers] = useState<TransferItem[]>([]);
  
  const [receivedFiles, setReceivedFiles] = useState<StoredFile[]>([]); 
  const [sessionReceivedFiles, setSessionReceivedFiles] = useState<StoredFile[]>([]); 
  const [sentFilesLog, setSentFilesLog] = useState<SentFileLog[]>([]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [fileQueue, setFileQueue] = useState<QueuedFile[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTabLocked, setIsTabLocked] = useState(false);

  const [tabBadges, setTabBadges] = useState<Record<string, number>>({ analytics: 0, storage: 0, history: 0, chat: 0 });
  const [lastTabUpdates, setLastTabUpdates] = useState<Record<string, number>>({});
  
  const [settings, setSettings] = useState<AppSettings>({
    autoDownload: true, 
    // 64KB is optimal for WebRTC DataChannels (reduces fragmentation/blocking)
    chunkSize: 64 * 1024, 
    maxPeers: 5
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('nw_theme');
    return saved ? saved === 'dark' : false;
  });

  const [analytics, setAnalytics] = useState({ 
    sentBytes: 0, 
    receivedBytes: 0, 
    totalCount: 0,
    successRate: 0,
    avgFileSize: 0,
    fileTypes: {} as Record<string, number>,
    storageUsed: 0,
    largestFile: 0,
    uniquePeers: 0
  });

  const incomingBuffers = useRef<Record<string, IncomingFileBuffer>>({});
  const activeTabRef = useRef(activeTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTransfersRef = useRef<TransferItem[]>([]);
  const connectedPeersRef = useRef<PeerInfo[]>([]);
  const lastProgressUpdate = useRef<Record<string, number>>({});
  const isTabLockedRef = useRef(isTabLocked);
  const tabId = useRef(crypto.randomUUID());
  
  const initRetryCount = useRef(0);
  const currentIdRef = useRef(myId);

  // Router Logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['tech', 'faq', 'info', 'howto'].includes(hash)) {
        setCurrentView(hash);
        window.scrollTo(0, 0);
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    connectedPeersRef.current = connectedPeers;
  }, [connectedPeers]);

  useEffect(() => {
    activeTransfersRef.current = activeTransfers;
  }, [activeTransfers]);

  useEffect(() => {
    currentIdRef.current = myId;
  }, [myId]);

  useEffect(() => {
    isTabLockedRef.current = isTabLocked;
  }, [isTabLocked]);

  useEffect(() => {
    const channel = new BroadcastChannel('nw_tab_lock');
    
    const handleMessage = (e: MessageEvent) => {
        if (e.data?.senderId === tabId.current) return;

        if (e.data.type === 'PING') {
            if (!isTabLockedRef.current) {
                channel.postMessage({ type: 'PONG', senderId: tabId.current });
            }
        } else if (e.data.type === 'PONG') {
            setIsTabLocked(true);
            setConnectedPeers([]);
        } else if (e.data.type === 'TAKEOVER') {
            setIsTabLocked(true);
            setConnectedPeers([]);
        }
    };

    channel.addEventListener('message', handleMessage);
    channel.postMessage({ type: 'PING', senderId: tabId.current });

    return () => {
        channel.removeEventListener('message', handleMessage);
        channel.close();
    };
  }, []);

  const handleTakeover = () => {
    setIsTabLocked(false);
    const channel = new BroadcastChannel('nw_tab_lock');
    channel.postMessage({ type: 'TAKEOVER', senderId: tabId.current });
    channel.close();
    
    if (myId) {
        peerService.initialize(myId);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nw_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nw_theme', 'light');
    }
  }, [darkMode]);

  const connectionState = isConnecting 
    ? ConnectionState.CONNECTING 
    : (connectedPeers.length > 0 ? ConnectionState.CONNECTED : ConnectionState.DISCONNECTED);

  useEffect(() => {
    const init = async () => {
      await pruneExpiredFiles();
      const savedFiles = await getFiles();
      setReceivedFiles(savedFiles);

      const savedIdentity = localStorage.getItem('nw_identity');
      if (savedIdentity) {
        try {
          const { id, name } = JSON.parse(savedIdentity);
          const isValidId = /^[A-Z0-9]+$/.test(id);
          if (isValidId) {
            setMyId(id);
            setMyName(name);
          } else {
            regenerateIdentity(name, true);
          }
        } catch (e) {
          setShowOnboarding(true);
        }
      } else {
        setShowOnboarding(true);
      }
      
      const recentPeers = getRecentPeers();
      
      const validCandidates = recentPeers.filter(p => {
         const diff = Date.now() - p.lastSeen;
         // 24 hours
         const isValid = diff < 24 * 60 * 60 * 1000;
         return isValid;
      });
      
      if (validCandidates.length > 0) {
        setReconnectCandidates(validCandidates);
      }
    };
    init();
    
    const cleanupInterval = setInterval(async () => {
      await pruneExpiredFiles();
      const files = await getFiles();
      setReceivedFiles(files);
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    const sentBytes = sentFilesLog.reduce((acc, f) => acc + (f.fileSize || 0), 0);
    const receivedBytes = receivedFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
    const totalCount = sentFilesLog.length + receivedFiles.length;
    const storageUsed = receivedFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
    const avgFileSize = totalCount > 0 ? (sentBytes + receivedBytes) / totalCount : 0;
    
    const failedSent = sentFilesLog.filter(f => f.status === TransferStatus.FAILED).length;
    const successRate = totalCount > 0 ? ((totalCount - failedSent) / totalCount) * 100 : 100;

    const fileTypes: Record<string, number> = {};
    let largestFile = 0;
    const uniquePeerSet = new Set<string>();

    [...sentFilesLog, ...receivedFiles].forEach(f => {
      const ext = f.fileName.split('.').pop()?.toUpperCase() || 'OTHER';
      const currentCount = fileTypes[ext] || 0;
      fileTypes[ext] = currentCount + 1;
      if (f.fileSize > largestFile) largestFile = f.fileSize;
    });

    sentFilesLog.forEach(f => uniquePeerSet.add(f.recipientId));
    receivedFiles.forEach(f => uniquePeerSet.add(f.senderId));
    connectedPeers.forEach(p => uniquePeerSet.add(p.id));

    setAnalytics(prev => ({
      ...prev,
      sentBytes,
      receivedBytes,
      totalCount,
      successRate,
      fileTypes,
      storageUsed,
      largestFile,
      avgFileSize,
      uniquePeers: uniquePeerSet.size
    }));
    
    updateTabTimestamp('analytics');
  }, [sentFilesLog, receivedFiles, connectedPeers]);

  useEffect(() => {
    setTabBadges(prev => ({ ...prev, [activeTab]: 0 }));
  }, [activeTab]);

  const peerTransferCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sentFilesLog.forEach(f => counts[f.recipientId] = (counts[f.recipientId] || 0) + 1);
    receivedFiles.forEach(f => counts[f.senderId] = (counts[f.senderId] || 0) + 1);
    return counts;
  }, [sentFilesLog, receivedFiles]);

  const updateTabTimestamp = (tabId: string) => {
    setLastTabUpdates(prev => ({ ...prev, [tabId]: Date.now() }));
  };

  const incrementBadge = (tabId: string) => {
    if (activeTabRef.current !== tabId) {
      setTabBadges(prev => ({ ...prev, [tabId]: (prev[tabId] || 0) + 1 }));
    }
    updateTabTimestamp(tabId);
  };

  const addToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const regenerateIdentity = (name: string, silent: boolean = false) => {
    setIsRegeneratingId(true);
    initRetryCount.current = 0;
    const newId = generatePeerId();
    setMyId(newId);
    localStorage.setItem('nw_identity', JSON.stringify({ id: newId, name, createdAt: Date.now() }));
    setTimeout(() => setIsRegeneratingId(false), 1000);
    if (!silent) {
      addToast('info', 'ID Refreshed', `New Identity: ${newId}`);
    } else {
      addToast('info', 'System Update', 'Identity refreshed to ensure connectivity');
    }
  };

  const createSenderWorker = () => {
    const code = `
      self.onmessage = async function(e) {
        const { type, file, chunkSize, startOffset } = e.data;
        if (type === 'INIT') {
           self.file = file;
           self.chunkSize = chunkSize;
           self.offset = startOffset || 0;
           self.postMessage({ type: 'READY' });
        } else if (type === 'NEXT') {
           if (self.offset < self.file.size) {
              const chunk = self.file.slice(self.offset, self.offset + self.chunkSize);
              const buffer = await chunk.arrayBuffer();
              self.postMessage({ type: 'CHUNK', data: buffer, offset: self.offset }, [buffer]);
              self.offset += self.chunkSize;
           } else {
              self.postMessage({ type: 'END' });
           }
        }
      };
    `;
    const blob = new Blob([code], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  };

  const handleOnboardingComplete = (name: string) => {
    const id = generatePeerId();
    setMyId(id);
    setMyName(name);
    localStorage.setItem('nw_identity', JSON.stringify({ id, name, createdAt: Date.now() }));
    setShowOnboarding(false);
    addToast('success', 'Welcome', 'Your identity has been created!');
  };

  const handleConnect = () => {
    if (remoteIdInput.length !== 6) {
      addToast('error', 'Invalid ID', 'ID must be 6 characters');
      return;
    }
    if (remoteIdInput === myId) {
      addToast('warning', 'Action Failed', "You can't connect to yourself");
      return;
    }
    if (connectedPeers.find(p => p.id === remoteIdInput)) {
      addToast('info', 'Already Connected', "You are already connected to this peer");
      return;
    }
    if (connectedPeers.length >= settings.maxPeers) {
      addToast('error', 'Limit Reached', `Max ${settings.maxPeers} peers allowed`);
      return;
    }
    
    setIsConnecting(true);
    peerService.connect(remoteIdInput);
    setRemoteIdInput('');
    setTimeout(() => setIsConnecting(false), 15000);
  };

  const handleReconnect = (ids: string[]) => {
    setIsConnecting(true);
    // Clear storage immediately on action to prevent re-prompting on refresh
    // If reconnection succeeds, the peer is re-added to storage in handleIncomingData
    clearRecentPeers(); 
    
    ids.forEach(id => {
      if (id !== myId && !connectedPeers.find(p => p.id === id)) {
        peerService.connect(id);
      }
    });
    setReconnectCandidates([]);
    addToast('info', 'Restoring', `Attempting to reconnect to ${ids.length} peer(s)...`);
    setTimeout(() => setIsConnecting(false), 10000);
  };

  const handleDiscardReconnect = () => {
    clearRecentPeers();
    setReconnectCandidates([]);
  };

  const handleDisconnectPeer = (peerId?: string) => {
      if (peerId) {
        // Send BYE message to ensure clean state on remote
        peerService.sendTo(peerId, { type: 'BYE' } as ProtocolMessage);
        
        // Give a small grace period for the message to be sent
        setTimeout(() => {
          peerService.disconnectPeer(peerId);
          setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
          removeRecentPeer(peerId);
        }, 100);
      } else {
        // Broadcast BYE to all
        peerService.sendToAll({ type: 'BYE' } as ProtocolMessage);
        
        setTimeout(() => {
          peerService.destroy();
          setConnectedPeers([]);
          peerService.initialize(myId);
          addToast('info', 'Session Cleared', 'All connections disconnected');
          clearRecentPeers();
        }, 100);
      }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    addToast('success', 'Copied!', 'Your ID has been copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileQueue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newQueueItems: QueuedFile[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file: file as File,
      addedAt: Date.now(),
      status: 'ready'
    }));

    setFileQueue(prev => [...prev, ...newQueueItems]);
    e.target.value = ''; 
    addToast('info', 'Files Added', `${newQueueItems.length} file(s) added to queue`);
  };

  const handleCreatedFile = (file: File) => {
    const newItem: QueuedFile = {
      id: crypto.randomUUID(),
      file: file,
      addedAt: Date.now(),
      status: 'ready'
    };
    setFileQueue(prev => [...prev, newItem]);
    addToast('info', 'File Created', `${file.name} added to queue`);
  };

  const removeQueuedFile = (id: string) => {
    setFileQueue(prev => prev.filter(f => f.id !== id));
  };

  const processQueue = async (targetPeerIds: string[]) => {
    if (connectionState !== ConnectionState.CONNECTED || targetPeerIds.length === 0) {
      addToast('error', 'No Recipient', "Please connect to a peer first!");
      return;
    }
    
    const itemsToSend = [...fileQueue];
    setFileQueue([]); 
    addToast('info', 'Sending...', `Starting transfer of ${itemsToSend.length} files`);

    for (const item of itemsToSend) {
      const targets = connectedPeers.filter(p => targetPeerIds.includes(p.id));
      const groupId = targets.length > 1 ? crypto.randomUUID() : undefined;
      
      for (const peer of targets) {
         const transferId = crypto.randomUUID();
         
         const newTransfer: TransferItem = {
           id: transferId,
           fileName: item.file.name,
           fileSize: item.file.size,
           fileType: item.file.type,
           progress: 0,
           direction: TransferDirection.OUTGOING,
           status: TransferStatus.IN_PROGRESS,
           timestamp: Date.now(),
           startTime: Date.now(),
           peerId: peer.id,
           groupId: groupId // Assign group ID
         };

         setActiveTransfers(prev => [newTransfer, ...prev]);
         // Do not await here to allow parallel sends to different peers
         sendFileToPeer(item.file, transferId, peer.id);
      }
    }
  };

  const sendFileToPeer = async (file: File, transferId: string, peerId: string) => {
    try {
      peerService.sendTo(peerId, {
        type: 'METADATA',
        transferId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      } as ProtocolMessage);

      const worker = createSenderWorker();
      
      worker.onmessage = async (e) => {
        const msg = e.data as any;
        
        if (msg.type === 'READY') {
            worker.postMessage({ type: 'NEXT' });
        }
        else if (msg.type === 'CHUNK') {
          // IMPLEMENT BACKPRESSURE via Event Listener (Non-Blocking for background tabs)
          try {
             await peerService.waitForBuffer(peerId);
             
             peerService.sendTo(peerId, {
                type: 'CHUNK',
                transferId,
                data: msg.data
             } as ProtocolMessage);

             const offset = msg.offset + msg.data.byteLength;
             const now = Date.now();
             const lastUpdate = lastProgressUpdate.current[transferId] || 0;
             
             if (now - lastUpdate > 100 || offset >= file.size) {
                const progress = Math.min(100, (offset / file.size) * 100);
                setActiveTransfers(prev => prev.map(t => 
                t.id === transferId ? { ...t, progress } : t
                ));
                lastProgressUpdate.current[transferId] = now;
             }
             
             // Request next chunk only after buffer check passed
             worker.postMessage({ type: 'NEXT' });
          } catch(err) {
              console.error("Backpressure error:", err);
              worker.terminate();
          }

        } else if (msg.type === 'END') {
           peerService.sendTo(peerId, { type: 'END', transferId } as ProtocolMessage);
           worker.terminate();
           setActiveTransfers(prev => prev.filter(t => t.id !== transferId));
           setSentFilesLog(prev => [{
             id: transferId,
             fileName: file.name,
             fileSize: file.size,
             fileType: file.type,
             recipientId: peerId,
             timestamp: Date.now(),
             status: TransferStatus.COMPLETED
           }, ...prev]);
           delete lastProgressUpdate.current[transferId];
           addToast('success', 'Sent', `${file.name} sent successfully!`);
        }
      };
      
      worker.onerror = (e) => {
          console.error("Worker error:", e);
          worker.terminate();
           setActiveTransfers(prev => prev.map(t => 
            t.id === transferId ? { ...t, status: TransferStatus.FAILED } : t
          ));
      };

      worker.postMessage({ type: 'INIT', file, chunkSize: settings.chunkSize });

    } catch (err) {
      setActiveTransfers(prev => prev.map(t => 
        t.id === transferId ? { ...t, status: TransferStatus.FAILED } : t
      ));
      delete lastProgressUpdate.current[transferId];
      addToast('error', 'Transfer Failed', `Failed to send ${file.name}`);
    }
  };

  const handleSendChatMessage = (text: string) => {
    const messageId = crypto.randomUUID();
    const newMessage: ChatMessage = {
      id: messageId,
      sender: 'me',
      text,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    peerService.sendToAll({
      type: 'CHAT',
      id: messageId,
      text,
      timestamp: Date.now(),
      senderName: myName
    } as ProtocolMessage);
  };

  const handleIncomingData = useCallback(async (data: ProtocolMessage, peerId: string) => {
    if (data.type === 'HANDSHAKE') {
      setConnectedPeers(prev => {
        const exists = prev.find(p => p.id === data.peerInfo.id);
        if (exists) {
           return prev.map(p => p.id === data.peerInfo.id ? { ...data.peerInfo, isSecure: true } : p);
        }
        return [...prev, { ...data.peerInfo, isSecure: true }];
      });
      updateTabTimestamp('management');
      addRecentPeer(data.peerInfo.id, data.peerInfo.name);
    }
    else if (data.type === 'METADATA') {
      const peerName = connectedPeersRef.current.find(p => p.id === peerId)?.name || 'Unknown Peer';
      
      incomingBuffers.current[data.transferId] = {
        chunks: [],
        receivedSize: 0,
        metadata: data,
        startTime: Date.now(),
        senderName: peerName
      };

      setActiveTransfers(prev => [{
        id: data.transferId,
        fileName: data.fileName!,
        fileSize: data.fileSize!,
        fileType: data.fileType!,
        progress: 0,
        direction: TransferDirection.INCOMING,
        status: TransferStatus.IN_PROGRESS,
        timestamp: Date.now(),
        startTime: Date.now(),
        peerId: peerId
      }, ...prev]);
      
      addToast('info', 'Receiving File', `Incoming transfer: ${data.fileName}`);
    } 
    else if (data.type === 'CHUNK') {
      const buffer = incomingBuffers.current[data.transferId];
      if (!buffer) return;

      if (data.data) {
        buffer.chunks.push(data.data);
        buffer.receivedSize += data.data.byteLength;
        
        const now = Date.now();
        const lastUpdate = lastProgressUpdate.current[data.transferId] || 0;
        
        if (now - lastUpdate > 100) {
            const progress = Math.min(100, (buffer.receivedSize / buffer.metadata.fileSize!) * 100);
            setActiveTransfers(prev => prev.map(t => t.id === data.transferId ? { ...t, progress } : t));
            lastProgressUpdate.current[data.transferId] = now;
        }
      }
    } 
    else if (data.type === 'END') {
      const buffer = incomingBuffers.current[data.transferId];
      if (!buffer) return;
      
      const blob = new Blob(buffer.chunks, { type: buffer.metadata.fileType });
      
      const storedFile: StoredFile = {
        id: data.transferId,
        fileName: buffer.metadata.fileName,
        fileSize: buffer.metadata.fileSize,
        fileType: buffer.metadata.fileType,
        blob: blob,
        senderName: buffer.senderName || 'Unknown Peer',
        senderId: peerId,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };

      await saveFile(storedFile);
      const files = await getFiles();
      setReceivedFiles(files);
      setSessionReceivedFiles(prev => [storedFile, ...prev]);
      
      setActiveTransfers(prev => prev.filter(t => t.id !== data.transferId));
      addToast('success', 'File Received', `${buffer.metadata.fileName} downloaded successfully`);
      incrementBadge('history');

      if (settings.autoDownload) {
          setTimeout(() => {
            try {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = buffer.metadata.fileName;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                   document.body.removeChild(a);
                   URL.revokeObjectURL(url);
                }, 100);
            } catch(e) {}
          }, 100);
      }

      delete incomingBuffers.current[data.transferId];
      delete lastProgressUpdate.current[data.transferId];
    }
    else if (data.type === 'CHAT') {
      setChatMessages(prev => [...prev, {
        id: data.id,
        sender: 'peer',
        peerId: peerId,
        senderName: data.senderName,
        text: data.text,
        timestamp: data.timestamp,
        attachment: data.attachment
      }]);
      incrementBadge('chat');
    }
    else if (data.type === 'BYE') {
       removeRecentPeer(peerId); // Remove from storage so we don't reconnect
       setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
       addToast('info', 'Disconnected', 'Peer ended the session');
       // Clean up connection
       peerService.disconnectPeer(peerId);
    }
  }, [settings.autoDownload]); 

  const handleDeleteHistory = async (id: string) => {
    await deleteFile(id);
    setReceivedFiles(prev => prev.filter(f => f.id !== id));
    setSessionReceivedFiles(prev => prev.filter(f => f.id !== id)); 
    addToast('info', 'Deleted', 'File removed from storage');
    updateTabTimestamp('storage');
    updateTabTimestamp('history');
  };

  const handleDismissSession = (id: string) => {
    setSessionReceivedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleCleanupStorage = async () => {
    const files = await getFiles();
    for(const f of files) {
       await deleteFile(f.id);
    }
    setReceivedFiles([]);
    setSessionReceivedFiles([]);
    addToast('success', 'Storage Cleared', 'All saved files removed');
    updateTabTimestamp('storage');
    updateTabTimestamp('history');
  };

  const handleSendFileTrigger = (peerId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (myId && !isTabLocked) {
      initRetryCount.current = 0;
      peerService.initialize(myId);
      return () => peerService.destroy();
    }
  }, [myId, isTabLocked]);

  useEffect(() => {
    if (!myId) return;

    peerService.setCallbacks(
      (connected, peerId) => {
        setIsConnecting(false);
        if (connected && peerId) {
          setConnectSuccess(true);
          setTimeout(() => setConnectSuccess(false), 2000);

          const sysInfo = getSystemInfo();
          const myInfo: PeerInfo = {
             id: myId,
             name: myName,
             os: sysInfo.os,
             browser: sysInfo.browser,
             connectedAt: Date.now(),
             isSecure: true
          };
          peerService.sendTo(peerId, { type: 'HANDSHAKE', peerInfo: myInfo } as ProtocolMessage);
          addToast('success', 'Peer Connected', `Connected to peer ${peerId}`);
          setReconnectCandidates(prev => prev.filter(p => p.id !== peerId));
          
          setChatMessages(prev => [...prev, {
             id: crypto.randomUUID(),
             sender: 'system',
             text: `------ ${peerId} connected ------`,
             timestamp: Date.now()
          }]);
          
          updateTabTimestamp('management');
        } else if (!connected && peerId) {
          const peer = connectedPeersRef.current.find(p => p.id === peerId);
          if (peer) {
              addToast('warning', 'Peer Disconnected', `${peer.name || peerId} has left the session.`);
              setChatMessages(prev => [...prev, {
                 id: crypto.randomUUID(),
                 sender: 'system',
                 text: `------ ${peerId} disconnected ------`,
                 timestamp: Date.now()
              }]);
          }

          // CRITICAL: Remove from recent peers on disconnect so we don't prompt on refresh
          // This ensures that if the other person leaves/refreshes, we don't try to reconnect to them
          // unless they initiate it later.
          removeRecentPeer(peerId);

          setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
          updateTabTimestamp('management');
        }
      },
      (data: ProtocolMessage, peerId) => handleIncomingData(data, peerId),
      (err) => {
        setIsConnecting(false);
        if (err === 'ID Unavailable or Invalid' || err.includes("unavailable")) {
             if (initRetryCount.current < 2) {
                 initRetryCount.current++;
                 addToast('warning', 'Session Restore', `Retrying connection (${initRetryCount.current}/2)...`);
                 setTimeout(() => {
                     if (currentIdRef.current === myId) {
                        peerService.initialize(myId);
                     }
                 }, 1500);
             } else {
                 regenerateIdentity(myName, true);
                 addToast('info', 'New Session', 'Previous ID was stuck, assigned new identity.');
             }
        } else if (err === 'Initialization Failed') {
             addToast('error', 'System Error', 'Connection system failed to start. Retrying automatically...');
        } else {
             addToast('error', 'Connection Error', err);
        }
      }
    );
  }, [myId, myName, handleIncomingData]); 

  // Routing render checks
  if (currentView === 'tech') return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><MagicLoader size={120} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
      <TechPage />
    </Suspense>
  );
  if (currentView === 'faq') return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><MagicLoader size={120} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
      <FAQPage />
    </Suspense>
  );
  if (currentView === 'info') return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><MagicLoader size={120} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
      <InfoPage />
    </Suspense>
  );
  if (currentView === 'howto') return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><MagicLoader size={120} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
      <HowToPage />
    </Suspense>
  );

  if (showOnboarding) return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><MagicLoader size={120} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
      <OnboardingModal onComplete={handleOnboardingComplete} />
    </Suspense>
  );

  const tabs: TabItem[] = [
    { id: 'history', label: 'History', icon: History, iconColor: 'text-lcoral-600 dark:text-lcoral-400', bgColor: 'bg-lcoral-100 dark:bg-lcoral-900/30', badge: receivedFiles.length, badgeVariant: 'count', timestamp: lastTabUpdates.history },
    { id: 'chat', label: 'Chat', icon: MessageSquare, iconColor: 'text-lavender-600 dark:text-lavender-400', bgColor: 'bg-lavender-100 dark:bg-lavender-900/30', badge: tabBadges.chat, badgeVariant: 'notification', timestamp: lastTabUpdates.chat },
    { id: 'management', label: 'Peers', icon: Users, iconColor: 'text-dusk-600 dark:text-dusk-400', bgColor: 'bg-dusk-100 dark:bg-dusk-900/30', badge: connectedPeers.length, badgeVariant: 'count', timestamp: lastTabUpdates.management },
    { id: 'analytics', label: 'Stats', icon: PieChart, iconColor: 'text-rosewood-600 dark:text-rosewood-400', bgColor: 'bg-rosewood-100 dark:bg-rosewood-900/30', timestamp: lastTabUpdates.analytics },
    { id: 'storage', label: 'Storage', icon: HardDrive, iconColor: 'text-bronze-600 dark:text-bronze-400', bgColor: 'bg-bronze-100 dark:bg-bronze-900/30', timestamp: lastTabUpdates.storage },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dusk-50 via-lavender-50/30 to-rosewood-50/20 dark:bg-black dark:bg-none text-dusk-900 dark:text-dusk-100 relative overflow-x-hidden selection:bg-lcoral-500/30 transition-colors duration-300">

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Reconnection Modal moved to root level for proper overlay */}
      <Suspense fallback={null}>
        <ReconnectionModal 
          candidates={reconnectCandidates} 
          onReconnect={handleReconnect}
          onDiscard={handleDiscardReconnect} 
        />
      </Suspense>

      <Suspense fallback={null}>
        <CreateFileModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSend={handleCreatedFile} />
      </Suspense>
      <Suspense fallback={null}>
        <SettingsBubble 
          settings={settings} 
          onUpdate={setSettings} 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)} 
          visible={fileQueue.length === 0}
        />
      </Suspense>
      <FloatingSendBar queue={fileQueue} peers={connectedPeers} onSend={processQueue} onClear={() => setFileQueue([])} />
      
      {/* Dusk-Coral Background - Static CSS for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-dusk-400/20 dark:bg-dusk-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
          <div className="absolute top-20 right-0 w-[25rem] h-[25rem] bg-lavender-400/25 dark:bg-lavender-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
          <div className="absolute -bottom-20 left-40 w-[35rem] h-[35rem] bg-rosewood-400/15 dark:bg-rosewood-900/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
          <div className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] bg-lcoral-400/10 dark:bg-dusk-800/5 rounded-full blur-[80px] mix-blend-overlay dark:mix-blend-normal" />
      </div>
      
      <header className="w-full px-4 py-6 mb-4 flex items-center justify-center md:justify-between relative z-10 max-w-6xl mx-auto select-none pointer-events-none">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="relative w-12 h-12 flex items-center justify-center">
             {/* Logo Image - Large but free-floating */}
             <img 
                src={LogoIcon} 
                alt="Logo" 
                className="absolute w-38 h-38 max-w-none object-contain z-0"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
             />
          </div>
          <div className="flex flex-col justify-center ml-2 relative z-20">
            <h1 className="text-3xl font-black tracking-tight leading-none">
              <span className="text-dusk-700 dark:text-dusk-200" style={{ WebkitTextStroke: '0.5px currentColor' }}>NOW</span><span className="text-lcoral-600 dark:text-lcoral-400" style={{ WebkitTextStroke: '0.5px currentColor' }}>HILE</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 relative z-10 flex flex-col pb-32" style={{ overflowAnchor: 'none' }}>
        <ConnectionStatus peers={connectedPeers} onDisconnect={handleDisconnectPeer} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="relative overflow-hidden bg-white/80 dark:bg-black/90 backdrop-blur-sm border border-dusk-200 dark:border-dusk-800 rounded-3xl p-6 shadow-xl shadow-dusk-200/50 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
             {isTabLocked && <TabLockModal onTakeover={handleTakeover} />}
             <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-bold text-dusk-600 dark:text-dusk-400 uppercase tracking-wider mb-1">Step 1</div>
                  <h2 className="text-xl font-bold text-dusk-900 dark:text-white">Establish Connection</h2>
                </div>
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-dusk-50 dark:bg-dusk-900/20 text-dusk-600 dark:text-dusk-400 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                   <Leaf className="w-5 h-5" />
                </motion.div>
             </div>
             <div className="space-y-4">
               <div className="p-4 bg-gradient-to-br from-dusk-50 to-lavender-50 dark:from-dusk-900 dark:to-lavender-900 rounded-2xl border border-dusk-200 dark:border-dusk-700 relative overflow-hidden group/id transition-colors hover:border-lcoral-300 dark:hover:border-lcoral-800">
                 <div className="relative z-10">
                   <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-bold text-lavender-500 uppercase tracking-widest">Your ID</div>
                      <motion.button 
                        onClick={() => regenerateIdentity(myName)}
                        disabled={isRegeneratingId}
                        className="p-1.5 hover:bg-lavender-200 dark:hover:bg-lavender-700 rounded-full transition-colors text-lavender-400 hover:text-lavender-600 dark:hover:text-lavender-300"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RefreshCw className={cn("w-3 h-3", isRegeneratingId && "animate-spin")} />
                      </motion.button>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                        <div className={cn("text-3xl font-bold text-dusk-800 dark:text-dusk-100 tracking-widest font-mono leading-none transition-opacity", isRegeneratingId ? "opacity-50" : "opacity-100")}>
                            {myId || '...'}
                        </div>
                        <div className="text-xs font-semibold text-lavender-500 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> {myName}
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        onClick={copyToClipboard}
                        className="bg-white dark:bg-black shadow-sm w-10 h-10 rounded-xl border-dusk-200 dark:border-dusk-700 hover:border-lcoral-400 hover:text-lcoral-600 dark:hover:text-lcoral-400"
                      >
                        {copied ? <Check className="w-4 h-4 text-rosewood-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                   </div>
                 </div>
               </div>
               <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-dusk-200 dark:border-dusk-800"></div>
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-white dark:bg-black px-2 text-lavender-500 font-bold">Or Connect To</span>
                 </div>
               </div>
               <div className="flex gap-2">
                 <div className="relative flex-1 group/input">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400 w-5 h-5 group-focus-within/input:text-lcoral-500 transition-colors" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Peer ID"
                      value={remoteIdInput}
                      onChange={(e) => setRemoteIdInput(e.target.value.toUpperCase())}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-black border-2 border-dusk-100 dark:border-dusk-800 rounded-xl text-lg font-bold text-dusk-800 dark:text-dusk-100 placeholder:text-lavender-300 dark:placeholder:text-lavender-600 focus:border-lcoral-500 focus:ring-4 focus:ring-lcoral-500/10 outline-none transition-all uppercase font-mono tracking-widest"
                    />
                 </div>
                 <Button 
                    onClick={handleConnect} 
                    disabled={!myId || remoteIdInput.length !== 6 || isConnecting} 
                    className={cn("h-12 w-12 p-0 rounded-xl flex-shrink-0 transition-all", connectSuccess ? "bg-rosewood-500 hover:bg-rosewood-600 border-rosewood-500 text-white" : "")}
                 >
                    {isConnecting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : connectSuccess ? (
                        <Check className="w-6 h-6" />
                    ) : (
                        <ArrowRight className="w-6 h-6" />
                    )}
                 </Button>
               </div>
             </div>
          </motion.div>
          <motion.div 
            className="bg-white/80 dark:bg-black/90 backdrop-blur-sm border border-lcoral-200 dark:border-lcoral-800 rounded-3xl p-6 shadow-xl shadow-lcoral-200/50 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 }}
          >
             <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-bold text-lcoral-600 dark:text-lcoral-400 uppercase tracking-wider mb-1">Step 2</div>
                  <h2 className="text-xl font-bold text-dusk-900 dark:text-white">Share Files</h2>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-2 text-xs font-bold text-lcoral-700 dark:text-lcoral-400 hover:text-lcoral-800 bg-lcoral-50 dark:bg-lcoral-900/20 hover:bg-lcoral-100 px-3 py-2 rounded-xl transition-colors border border-lcoral-200 dark:border-lcoral-800"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Create
                    </motion.button>
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-lcoral-50 dark:bg-lcoral-900/20 text-lcoral-600 dark:text-lcoral-400 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                       <Sparkles className="w-5 h-5" />
                    </motion.div>
                </div>
             </div>
             <div className="flex-1 relative group/drop cursor-pointer">
               <input 
                  type="file" 
                  multiple 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handleFileQueue}
                  ref={fileInputRef}
               />
               <div className="h-40 w-full rounded-2xl border-2 border-dashed border-lavender-300 dark:border-lavender-700 bg-dusk-50/50 dark:bg-black/50 group-hover/drop:border-lcoral-500 group-hover/drop:bg-lcoral-50/30 dark:group-hover/drop:bg-lcoral-900/20 transition-all duration-300 flex flex-col items-center justify-center text-center p-4">
                  <motion.div 
                    className="w-14 h-14 bg-white dark:bg-black rounded-full shadow-sm flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Wind className="w-6 h-6 text-lcoral-500" />
                  </motion.div>
                  <h3 className="text-sm font-bold text-dusk-700 dark:text-dusk-200 mb-1">Drop files here</h3>
                  <p className="text-xs text-lavender-500 max-w-[200px] mx-auto leading-relaxed">Support for images, videos, documents & archives</p>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-lavender-100 dark:border-lavender-800 flex justify-between items-center">
                 <div className="text-xs text-lavender-500 font-medium">No size limits • P2P Encrypted</div>
             </div>
          </motion.div>
        </div>

        <QueueList files={fileQueue} onRemove={removeQueuedFile} />
        <TransferList transfers={activeTransfers} />

        <div className="w-full space-y-6 mb-8">
          {sessionReceivedFiles.length > 0 && (
             <motion.div 
               className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-french-100/50 dark:border-french-900/30 rounded-3xl p-6 shadow-xl shadow-french-500/5 relative overflow-hidden"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-french-400 via-french-500 to-sky-500 opacity-40" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="p-2.5 bg-french-50 dark:bg-french-900/30 text-french-600 dark:text-french-400 rounded-xl shadow-sm border border-french-100 dark:border-french-800">
                      <History className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-taupe-900 dark:text-white text-lg">Received Files</h3>
                      <p className="text-xs text-taupe-500 dark:text-taupe-400">Files downloaded in this session</p>
                   </div>
                </div>
                <div className="relative z-10 w-full">
                  <ReceivedFileList files={sessionReceivedFiles} onRemove={handleDismissSession} />
                </div>
             </motion.div>
          )}
          
          {sentFilesLog.length > 0 && (
             <motion.div 
               className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-sky-100/50 dark:border-sky-900/30 rounded-3xl p-6 shadow-xl shadow-sky-500/5 relative overflow-hidden"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 }}
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-french-500 opacity-40" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="p-2.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl shadow-sm border border-sky-100 dark:border-sky-800">
                      <Send className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-taupe-900 dark:text-white text-lg">Sent History</h3>
                      <p className="text-xs text-taupe-500 dark:text-taupe-400">Transfer logs for this session</p>
                   </div>
                </div>
                <div className="relative z-10 w-full">
                  <SentFileList files={sentFilesLog} />
                </div>
             </motion.div>
          )}
        </div>

        <div className="mt-2 bg-white/60 dark:bg-black/60 backdrop-blur-md border border-lavender-100/50 dark:border-lavender-800 rounded-3xl p-1 shadow-sm flex flex-col min-h-[300px]">
           <div className="p-2">
              <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
           </div>
           <div className="flex-1 p-4 md:p-6 relative">
              {activeTab === 'management' && (
                 <PeerList 
                    peers={connectedPeers} 
                    onDisconnect={handleDisconnectPeer} 
                    onSendFile={handleSendFileTrigger} 
                    transferCounts={peerTransferCounts}
                 />
              )}
              {activeTab === 'chat' && (
                 <Suspense fallback={<div className="flex items-center justify-center p-8"><MagicLoader size={60} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
                   <ChatTab 
                      messages={chatMessages}
                      onSendMessage={handleSendChatMessage}
                      myId={myId}
                      isConnected={connectedPeers.length > 0}
                   />
                 </Suspense>
              )}
              {activeTab === 'history' && (
                 <FileHistoryList 
                    files={receivedFiles} 
                    onDelete={handleDeleteHistory} 
                 />
              )}
              {activeTab === 'storage' && (
                <Suspense fallback={<div className="flex items-center justify-center p-8"><MagicLoader size={60} saturation={0} lightness={0} hueRange={[0, 0]} /></div>}>
                  <StorageTab files={receivedFiles} onCleanup={handleCleanupStorage} />
                </Suspense>
              )}
              {activeTab === 'analytics' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                    <div className="bg-white dark:bg-black p-5 rounded-2xl border border-lcoral-200 dark:border-lcoral-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-lcoral-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-lcoral-900/20" />
                       <div className="p-3 rounded-xl bg-lcoral-50 dark:bg-lcoral-900/30 text-lcoral-600 dark:text-lcoral-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Gem className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-lavender-500 uppercase">Peak Transfer</div>
                          <div className="text-lg font-black text-dusk-900 dark:text-white flex items-center gap-1">
                            {formatFileSize(analytics.largestFile)}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-black p-5 rounded-2xl border border-bronze-200 dark:border-bronze-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-bronze-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-bronze-900/20" />
                       <div className="p-3 rounded-xl bg-bronze-50 dark:bg-bronze-900/30 text-bronze-600 dark:text-bronze-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Scale className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-lavender-500 uppercase">Avg File Size</div>
                          <div className="text-lg font-black text-dusk-900 dark:text-white flex items-center gap-1">
                            {formatFileSize(analytics.avgFileSize)}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-black p-5 rounded-2xl border border-rosewood-200 dark:border-rosewood-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-rosewood-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-rosewood-900/20" />
                       <div className="p-3 rounded-xl bg-rosewood-50 dark:bg-rosewood-900/30 text-rosewood-600 dark:text-rosewood-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Activity className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-lavender-500 uppercase">Success Rate</div>
                          <div className="text-lg font-black text-dusk-900 dark:text-white flex items-center gap-1">
                            {analytics.successRate.toFixed(0)}%
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-black p-5 rounded-2xl border border-lavender-200 dark:border-lavender-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-lavender-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-lavender-900/20" />
                       <div className="p-3 rounded-xl bg-lavender-50 dark:bg-lavender-900/30 text-lavender-600 dark:text-lavender-400 relative z-10 group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-lavender-500 uppercase">Total Traffic</div>
                          <div className="text-lg font-black text-dusk-900 dark:text-white flex items-center gap-1">
                            {formatFileSize(analytics.sentBytes + analytics.receivedBytes)}
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
      // Background removed, loader set to black (sat=0, light=0)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf8f6] dark:bg-[#0a0909]">
        <MagicLoader 
          size={250} 
          speed={1.8} 
          particleCount={3} 
          hueRange={[0, 0]} 
          saturation={0} 
          lightness={0} 
        />
      </div>
    );
  }

  return <MainContent />;
}
