import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Link2,
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
  Award
} from './components/Icons';
import { Button } from './components/Button';
import { TransferList } from './components/TransferList';
import { ReceivedFileList } from './components/ReceivedFileList';
import { SentFileList } from './components/SentFileList';
import { QueueList } from './components/QueueList';
import { CreateFileModal } from './components/CreateFileModal';
import { SettingsBubble } from './components/SettingsBubble';
import { OnboardingModal } from './components/OnboardingModal';
import { ToastContainer } from './components/Toast';
import { ConnectionStatus } from './components/ConnectionStatus';
import { PeerList } from './components/PeerList';
import { FloatingSendBar } from './components/FloatingSendBar';
import { Footer } from './components/Footer';
import { StorageTab } from './components/StorageTab';
import { ReconnectionModal } from './components/ReconnectionModal';
import { Tabs, TabItem } from './components/Tabs';
import { FileHistoryList } from './components/FileHistoryList';
import { ChatTab } from './components/ChatTab';
import { TabLockModal } from './components/TabLockModal';
import TechPage from './components/TechPage';
import FAQPage from './components/FAQPage';
import InfoPage from './components/InfoPage';
import HowToPage from './components/HowToPage';

interface IncomingFileBuffer {
  chunks: ArrayBuffer[];
  receivedSize: number;
  metadata: ProtocolMessage & { type: 'METADATA' };
  startTime: number;
  senderName?: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'app' | 'tech' | 'faq' | 'info' | 'howto'>('app');
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
    chunkSize: 65536, 
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
  
  // Retry logic refs
  const initRetryCount = useRef(0);
  const currentIdRef = useRef(myId);

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

  // Tab Lock Logic
  useEffect(() => {
    const channel = new BroadcastChannel('nw_tab_lock');
    
    const handleMessage = (e: MessageEvent) => {
        // Ignore own messages to prevent feedback loops
        if (e.data?.senderId === tabId.current) return;

        if (e.data.type === 'PING') {
            // If we are active (not locked), tell the new tab to lock
            if (!isTabLockedRef.current) {
                channel.postMessage({ type: 'PONG', senderId: tabId.current });
            }
        } else if (e.data.type === 'PONG') {
            // Existing tab found, lock myself
            setIsTabLocked(true);
            setConnectedPeers([]);
        } else if (e.data.type === 'TAKEOVER') {
            // User switched to another tab, lock myself
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
    // Send senderId so we don't receive our own takeover message
    channel.postMessage({ type: 'TAKEOVER', senderId: tabId.current });
    channel.close();
    
    // Re-init if we have an ID
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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#tech') {
        setCurrentView('tech');
        window.scrollTo(0,0);
      } else if (hash === '#faq') {
        setCurrentView('faq');
        window.scrollTo(0,0);
      } else if (hash === '#info') {
        setCurrentView('info');
        window.scrollTo(0,0);
      } else if (hash === '#howto') {
        setCurrentView('howto');
        window.scrollTo(0,0);
      } else {
        setCurrentView('app');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      const validCandidates = recentPeers.filter(p => Date.now() - p.lastSeen < 24 * 60 * 60 * 1000);
      
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
    const sentBytes = sentFilesLog.reduce((acc, f) => acc + f.fileSize, 0);
    const receivedBytes = receivedFiles.reduce((acc, f) => acc + f.fileSize, 0);
    const totalCount = sentFilesLog.length + receivedFiles.length;
    const storageUsed = receivedFiles.reduce((acc, f) => acc + f.fileSize, 0);
    const avgFileSize = totalCount > 0 ? (sentBytes + receivedBytes) / totalCount : 0;
    
    const failedSent = sentFilesLog.filter(f => f.status === TransferStatus.FAILED).length;
    const successRate = totalCount > 0 ? ((totalCount - failedSent) / totalCount) * 100 : 100;

    const fileTypes: Record<string, number> = {};
    let largestFile = 0;
    const uniquePeerSet = new Set<string>();

    [...sentFilesLog, ...receivedFiles].forEach(f => {
      const ext = f.fileName.split('.').pop()?.toUpperCase() || 'OTHER';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
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
    const code = `self.onmessage=async function(e){const{file,chunkSize}=e.data;let offset=0;const total=file.size;try{while(offset<total){const chunk=file.slice(offset,offset+chunkSize);const buffer=await chunk.arrayBuffer();self.postMessage({type:'CHUNK',data:buffer,offset:offset},[buffer]);offset+=chunkSize;}self.postMessage({type:'END'});}catch(err){self.postMessage({type:'ERROR',error:err.message});}};`;
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
        peerService.disconnectPeer(peerId);
        setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
        removeRecentPeer(peerId);
      } else {
        peerService.destroy();
        setConnectedPeers([]);
        peerService.initialize(myId);
        addToast('info', 'Session Cleared', 'All connections disconnected');
        clearRecentPeers();
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
           peerId: peer.id
         };

         setActiveTransfers(prev => [newTransfer, ...prev]);
         await sendFileToPeer(item.file, transferId, peer.id);
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
      
      worker.onmessage = (e) => {
        if (e.data.type === 'CHUNK') {
          peerService.sendTo(peerId, {
            type: 'CHUNK',
            transferId,
            data: e.data.data
          } as ProtocolMessage);

          const offset = e.data.offset + e.data.data.byteLength;
          const now = Date.now();
          const lastUpdate = lastProgressUpdate.current[transferId] || 0;
          
          if (now - lastUpdate > 100 || offset >= file.size) {
            const progress = Math.min(100, (offset / file.size) * 100);
            setActiveTransfers(prev => prev.map(t => 
              t.id === transferId ? { ...t, progress } : t
            ));
            lastProgressUpdate.current[transferId] = now;
          }
        } else if (e.data.type === 'END') {
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
        } else if (e.data.type === 'ERROR') {
           worker.terminate();
           throw new Error(e.data.error || "Worker Error");
        }
      };

      worker.postMessage({ file, chunkSize: settings.chunkSize });

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
          setConnectedPeers(prev => {
             const peer = prev.find(p => p.id === peerId);
             if(peer) addToast('warning', 'Peer Disconnected', `${peer.name || peerId} has left the session.`);
             return prev.filter(p => p.id !== peerId);
          });
          
          removeRecentPeer(peerId);
          
          setChatMessages(prev => [...prev, {
             id: crypto.randomUUID(),
             sender: 'system',
             text: `------ ${peerId} disconnected ------`,
             timestamp: Date.now()
          }]);

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

  if (currentView === 'tech') return <TechPage />;
  if (currentView === 'faq') return <FAQPage />;
  if (currentView === 'info') return <InfoPage />;
  if (currentView === 'howto') return <HowToPage />;
  if (showOnboarding) return <OnboardingModal onComplete={handleOnboardingComplete} />;

  const tabs: TabItem[] = [
    { id: 'history', label: 'History', icon: History, iconColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', badge: receivedFiles.length, badgeVariant: 'count', timestamp: lastTabUpdates.history },
    { id: 'chat', label: 'Chat', icon: MessageSquare, iconColor: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-100 dark:bg-violet-900/30', badge: tabBadges.chat, badgeVariant: 'notification', timestamp: lastTabUpdates.chat },
    { id: 'management', label: 'Peers', icon: Users, iconColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', badge: connectedPeers.length, badgeVariant: 'count', timestamp: lastTabUpdates.management },
    { id: 'analytics', label: 'Stats', icon: PieChart, iconColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', timestamp: lastTabUpdates.analytics },
    { id: 'storage', label: 'Storage', icon: HardDrive, iconColor: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30', timestamp: lastTabUpdates.storage },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 relative overflow-x-hidden selection:bg-violet-500/30 transition-colors duration-300">
      {isTabLocked && <TabLockModal onTakeover={handleTakeover} />}
      <style>{`@keyframes spin-slow{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.animate-spin-slow{animation:spin-slow 8s linear infinite}@keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}.animate-float{animation:float 6s ease-in-out infinite}.animate-float-delayed{animation:float 7s ease-in-out 2s infinite}@keyframes shimmer{0%{transform:translateX(-150%) skewX(-12deg)}30%{transform:translateX(150%) skewX(-12deg)}100%{transform:translateX(150%) skewX(-12deg)}}.animate-shimmer{animation:shimmer 3s infinite}@keyframes text-shimmer{0%{background-position:0% 50%}100%{background-position:100% 50%}}.animate-text-shimmer{background:linear-gradient(to right,#0f172a 20%,#475569 40%,#94a3b8 50%,#475569 60%,#0f172a 80%);background-size:200% auto;color:#000;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:text-shimmer 8s linear infinite}.dark .animate-text-shimmer{background:linear-gradient(to right,#ffffff 20%,#94a3b8 40%,#475569 50%,#94a3b8 60%,#ffffff 80%);background-size:200% auto;color:#fff;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:text-shimmer 8s linear infinite}`}</style>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ReconnectionModal candidates={reconnectCandidates} onReconnect={handleReconnect} onDiscard={handleDiscardReconnect} />
      <CreateFileModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSend={handleCreatedFile} />
      <SettingsBubble settings={settings} onUpdate={setSettings} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <FloatingSendBar queue={fileQueue} peers={connectedPeers} onSend={processQueue} onClear={() => setFileQueue([])} />
      
      <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-200/40 dark:bg-violet-900/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      
      <header className="w-full px-4 py-6 mb-4 flex items-center justify-between relative z-10 max-w-6xl mx-auto select-none pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="absolute inset-0 bg-violet-600 blur-lg opacity-40 rounded-full" />
             <div className="relative z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border border-slate-800 dark:border-slate-200 shadow-xl tracking-tighter overflow-hidden">
               <span className="relative z-20">NW</span>
               <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
             </div>
          </div>
          <div className="flex flex-col justify-center h-10">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none relative animate-text-shimmer">NOWHILE</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 relative z-10 flex flex-col pb-12" style={{ overflowAnchor: 'none' }}>
        <ConnectionStatus peers={connectedPeers} onDisconnect={handleDisconnectPeer} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-[#0F0F0F]/90 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 group">
             <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Step 1</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Establish Connection</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                   <Scan className="w-5 h-5" />
                </div>
             </div>
             <div className="space-y-4">
               <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 relative overflow-hidden group/id transition-colors hover:border-violet-200 dark:hover:border-violet-800">
                 <div className="relative z-10">
                   <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your ID</div>
                      <button 
                        onClick={() => regenerateIdentity(myName)}
                        disabled={isRegeneratingId}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <RefreshCw className={cn("w-3 h-3", isRegeneratingId && "animate-spin")} />
                      </button>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                        <div className={cn("text-3xl font-black text-slate-800 dark:text-slate-100 tracking-widest font-mono leading-none transition-opacity", isRegeneratingId ? "opacity-50" : "opacity-100")}>
                            {myId || '...'}
                        </div>
                        <div className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> {myName}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={copyToClipboard}
                        className="bg-white dark:bg-neutral-800 shadow-sm p-0 w-10 h-10 rounded-xl border-slate-200 dark:border-neutral-700 hover:border-violet-300 hover:text-violet-600 dark:hover:text-violet-400"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                   </div>
                 </div>
               </div>
               <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-white dark:bg-[#0F0F0F] px-2 text-slate-400 font-bold">Or Connect To</span>
                 </div>
               </div>
               <div className="flex gap-2">
                 <div className="relative flex-1 group/input">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/input:text-violet-500 transition-colors" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Peer ID"
                      value={remoteIdInput}
                      onChange={(e) => setRemoteIdInput(e.target.value.toUpperCase())}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-900 border-2 border-slate-100 dark:border-neutral-800 rounded-xl text-lg font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-neutral-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all uppercase font-mono tracking-widest"
                    />
                 </div>
                 <Button 
                    onClick={handleConnect} 
                    disabled={!myId || remoteIdInput.length !== 6 || isConnecting} 
                    className={cn("h-12 w-12 p-0 rounded-xl flex-shrink-0 transition-all", connectSuccess ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white" : "")}
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
          </div>
          <div className="bg-white/80 dark:bg-[#0F0F0F]/90 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 group flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Step 2</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Share Files</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 px-3 py-2 rounded-xl transition-colors border border-violet-100 dark:border-violet-800 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <Cloud className="w-5 h-5" />
                    </div>
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
               <div className="h-40 w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900/50 group-hover/drop:border-violet-500 group-hover/drop:bg-violet-50/30 dark:group-hover/drop:bg-violet-900/20 transition-all duration-300 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover/drop:scale-110 transition-transform">
                    <MousePointer2 className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Drop files here</h3>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Support for images, videos, documents & archives</p>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center">
                 <div className="text-xs text-slate-400 font-medium">No size limits • P2P Encrypted</div>
             </div>
          </div>
        </div>

        <QueueList files={fileQueue} onRemove={removeQueuedFile} />
        <TransferList transfers={activeTransfers} />

        <div className="w-full space-y-6 mb-8">
          {sessionReceivedFiles.length > 0 && (
             <div className="w-full bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-xl border border-emerald-100/50 dark:border-emerald-900/30 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 opacity-30" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800">
                      <History className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Received Files</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Files downloaded in this session</p>
                   </div>
                </div>
                <div className="relative z-10 w-full">
                  <ReceivedFileList files={sessionReceivedFiles} onRemove={handleDismissSession} />
                </div>
             </div>
          )}
          
          {sentFilesLog.length > 0 && (
             <div className="w-full bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-xl border border-blue-100/50 dark:border-blue-900/30 rounded-3xl p-6 shadow-xl shadow-blue-500/5 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 opacity-30" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
                      <Send className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Sent History</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Transfer logs for this session</p>
                   </div>
                </div>
                <div className="relative z-10 w-full">
                  <SentFileList files={sentFilesLog} />
                </div>
             </div>
          )}
        </div>

        <div className="mt-2 bg-white/60 dark:bg-[#0F0F0F]/60 backdrop-blur-md border border-white/50 dark:border-neutral-800 rounded-3xl p-1 shadow-sm flex flex-col min-h-[300px]">
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
                 <ChatTab 
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    myId={myId}
                    isConnected={connectedPeers.length > 0}
                 />
              )}
              {activeTab === 'history' && (
                 <FileHistoryList 
                    files={receivedFiles} 
                    onDelete={handleDeleteHistory} 
                 />
              )}
              {activeTab === 'storage' && (
                <StorageTab files={receivedFiles} onCleanup={handleCleanupStorage} />
              )}
              {activeTab === 'analytics' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-rose-900/20" />
                       <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Award className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-slate-400 uppercase">Peak Transfer</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
                            {formatFileSize(analytics.largestFile)}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-amber-900/20" />
                       <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Scale className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-slate-400 uppercase">Avg File Size</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
                            {formatFileSize(analytics.avgFileSize)}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-cyan-900/20" />
                       <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 relative z-10 group-hover:scale-110 transition-transform">
                          <Globe className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-xs font-bold text-slate-400 uppercase">Unique Peers</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
                            {analytics.uniquePeers}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:border-slate-200 dark:hover:border-neutral-700 transition-colors">
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-300">
                            <HardDrive className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Data Received</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white">{formatFileSize(analytics.receivedBytes)}</div>
                         </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:border-slate-200 dark:hover:border-neutral-700 transition-colors">
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-300">
                            <TrendingUp className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Total Transfers</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white">{analytics.totalCount} Files</div>
                         </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:border-slate-200 dark:hover:border-neutral-700 transition-colors">
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-300">
                            <Activity className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Success Rate</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white">{analytics.successRate.toFixed(1)}%</div>
                         </div>
                    </div>
                    <div className="col-span-full bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-sm mt-2">
                       <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Top File Types</h3>
                       <div className="flex flex-wrap gap-2">
                          {Object.entries(analytics.fileTypes).length === 0 && <span className="text-sm text-slate-400 italic">No data yet</span>}
                          {Object.entries(analytics.fileTypes).map(([type, count]) => {
                             const percentage = analytics.totalCount > 0 ? Math.round((count / analytics.totalCount) * 100) : 0;
                             return (
                               <div key={type} className="px-3 py-2 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-100 dark:border-neutral-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-3 min-w-[140px] justify-between">
                                  <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                     <span>{type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <span className="text-slate-400 font-normal">{percentage}%</span>
                                     <span className="bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded shadow-sm text-slate-600 dark:text-slate-200">{count}</span>
                                  </div>
                               </div>
                             );
                          })}
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

export default App;
