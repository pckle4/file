
import React, { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Users,
  Upload,
  Wifi,
  Shield,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Activity,
  Server,
  Brain,
  Eye,
  Network,
  CheckCircle,
  Code2,
  Lock,
  Database,
  GitBranch,
  Layers,
  AlertTriangle,
  Info,
  Binary,
  Workflow,
  PackageCheck,
  CircuitBoard,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Gauge,
  ArrowLeft,
  HardDrive,
  TriangleAlert
} from "lucide-react"
import { Footer } from "./Footer"
import { cn } from "../utils"

// Reusable UI Components for this page
const Card = ({ children, className }: any) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all", className)}>
    {children}
  </div>
);
const CardHeader = ({ children, className }: any) => <div className={cn("p-6 pb-3", className)}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-3", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-lg font-bold text-slate-900", className)}>{children}</h3>;
const CardDescription = ({ children, className }: any) => <p className="text-sm text-slate-500 mt-1 leading-relaxed">{children}</p>;

const Badge = ({ children, variant = 'default', className }: any) => {
  const variants: any = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-transparent border-slate-200 text-slate-600 border',
    secondary: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit", variants[variant], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'default', size = 'default', onClick, className }: any) => {
    const variants: any = {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
        outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
    };
    const sizes: any = {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs'
    };
    return (
        <button onClick={onClick} className={cn("inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}>
            {children}
        </button>
    )
}

const Separator = () => <div className="h-[1px] w-full bg-slate-100 my-4" />;

export default function InfoPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const setTab = (componentId: string, tabValue: string) => {
      setActiveTabs(prev => ({
          ...prev,
          [componentId]: tabValue
      }))
  }

  const components = [
    {
      id: "peer-service",
      title: "Peer Service (Core)",
      description: "Singleton service managing WebRTC connection lifecycle.",
      icon: Users,
      category: "Core Logic",
      details: {
        purpose:
          "Establishes and manages secure WebRTC connections between peers using PeerJS. It abstracts the complexity of connection handling, error recovery, and event dispatching from the UI components.",
        features: [
          "Singleton design pattern for global access",
          "Automatic reconnection with backoff strategy",
          "Event-driven callbacks (onConnectionChange, onDataReceived)",
          "ICE server configuration (STUN/TURN)",
          "Connection cleanup and memory management",
        ],
        technical: {
          library: "PeerJS (v1.5+)",
          protocol: "WebRTC DataChannel",
          transport: "UDP (SCTP)",
          signaling: "WebSocket (via PeerJS Cloud)",
        },
        codeExample: `class PeerService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();

  initialize(myId: string) {
    this.peer = new Peer(myId, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      }
    });
    
    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });
  }

  connect(remoteId: string) {
    const conn = this.peer.connect(remoteId, {
      reliable: true
    });
    this.handleConnection(conn);
  }
}`,
        files: [
          "services/peerService.ts",
          "App.tsx",
          "types.ts",
        ],
        howItWorks: [
          "App initializes PeerService with a unique ID.",
          "PeerService connects to signaling server.",
          "When connecting to a peer, it creates a DataConnection.",
          "Events (open, data, close) are forwarded to App.tsx via callbacks.",
        ],
      },
    },
    {
      id: "transfer-logic",
      title: "File Transfer Logic",
      description: "Chunk-based binary transfer implementation with Worker support.",
      icon: Upload,
      category: "Core Logic",
      details: {
        purpose:
          "Handles the reading of files, chunking them into small packets (64KB), sending them over the network, and reassembling them on the receiving end to support large file transfers.",
        features: [
          "Chunked transmission (default 64KB)",
          "Web Worker offloading for UI responsiveness",
          "Progress calculation and tracking",
          "Blob reassembly from ArrayBuffers",
          "Protocol message handling (METADATA, CHUNK, END)",
        ],
        technical: {
          chunking: "FileReader.readAsArrayBuffer slice()",
          concurrency: "Web Workers API",
          reassembly: "InMemory ArrayBuffer[]",
          protocol: "Custom JSON + Binary Protocol",
        },
        codeExample: `// Worker processing a file chunk
self.onmessage = async function(e) {
  const { file, chunkSize } = e.data;
  let offset = 0;
  
  while (offset < file.size) {
     const chunk = file.slice(offset, offset + chunkSize);
     const buffer = await chunk.arrayBuffer();
     self.postMessage({ type: 'CHUNK', data: buffer }); 
     offset += chunkSize;
  }
  self.postMessage({ type: 'END' });
};`,
        files: [
          "App.tsx (handleIncomingData, sendFileToPeer)",
          "components/TransferList.tsx",
        ],
        howItWorks: [
          "Sender sends METADATA message with file details.",
          "Sender uses Web Worker to slice file into 64KB chunks.",
          "Sender transmits CHUNK messages containing binary data.",
          "Receiver buffers chunks in memory.",
          "Sender sends END message; Receiver creates Blob and saves.",
        ],
      },
    },
    {
      id: "storage-layer",
      title: "Persistence (IndexedDB)",
      description: "Client-side database for file history and large blobs.",
      icon: Database,
      category: "Data Layer",
      details: {
        purpose:
          "Provides persistent storage for received files and transfer history. Using IndexedDB allows storing Blobs much larger than what localStorage supports, ensuring file availability across reloads.",
        features: [
          "Asynchronous CRUD operations",
          "Blob storage support",
          "Automatic expiration (24h TTL)",
          "Storage quota management",
        ],
        technical: {
          api: "IndexedDB API",
          dbName: "NWShareDB",
          storeName: "files",
          keyPath: "id",
        },
        codeExample: `export const saveFile = async (file: StoredFile) => {
  const db = await initDB();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  
  // Add 24h expiry
  const fileWithExpiry = {
    ...file,
    expiresAt: Date.now() + 86400000
  };
  
  store.put(fileWithExpiry);
};`,
        files: [
          "services/db.ts",
          "components/StorageTab.tsx",
        ],
        howItWorks: [
          "Database initialized on app load.",
          "Received files are saved as StoredFile objects.",
          "Blobs are stored directly in IndexedDB.",
          "App.tsx checks for expired files on interval.",
        ],
      },
    },
    {
      id: "ui-components",
      title: "UI Component Library",
      description: "Tailwind-styled reusable interface components.",
      icon: Layers,
      category: "UI/UX",
      details: {
        purpose:
          "A set of modular, reusable React components built with Tailwind CSS to ensure consistency and responsiveness across the application.",
        features: [
          "Responsive Grid Layouts",
          "Custom Tab Navigation",
          "File Type Icons",
          "Toast Notification System",
          "Modal Dialogs",
        ],
        technical: {
          framework: "React Functional Components",
          styling: "Tailwind CSS Utility Classes",
          icons: "Lucide React",
        },
        codeExample: `export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', ...props 
}) => {
  return (
    <button 
      className={cn(
        "rounded-xl font-medium transition-all",
        variant === 'primary' ? "bg-violet-600 text-white" : "bg-white"
      )}
      {...props}
    >
      {children}
    </button>
  );
};`,
        files: [
          "components/Button.tsx",
          "components/FileIcon.tsx",
          "components/Tabs.tsx",
          "components/Toast.tsx",
        ],
        howItWorks: [
          "Components receive props for data and callbacks.",
          "Tailwind classes handle all styling and dark mode.",
          "Utility function 'cn' handles class merging.",
        ],
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => window.location.hash = ''} 
              className="group flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
            >
                <div className="p-1 bg-white rounded-full border border-slate-200 group-hover:border-transparent group-hover:bg-white/20 text-slate-400 group-hover:text-white transition-colors">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                <span className="tracking-tight">Back to App</span>
            </button>
            <div className="font-black text-xl tracking-tighter text-slate-900">NW Component Info</div>
        </div>
      </header>

      <main className="flex-1 pt-10 px-4 pb-12 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-6xl mx-auto space-y-8">
          
           {/* Educational Notice - Animated Point Wise */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-300 group animate-fade-in">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/50 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-amber-100 text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <TriangleAlert className="h-6 w-6 animate-pulse" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-amber-900 tracking-tight">Architecture Overview</h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">Important</span>
                      </div>
                      
                      <ul className="space-y-2.5">
                          {[
                              "This application leverages a purely client-side architecture using WebRTC and IndexedDB.",
                              "It follows a Singleton Service pattern for managing peer connections.",
                              "Data flow is unidirectional during file transfers, utilizing a custom chunking protocol.",
                              "UI updates are event-driven, ensuring real-time feedback without polling."
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-amber-800/80">
                                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500 shadow-sm" />
                                  <span className="leading-relaxed">{item}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>

          {/* Header Section */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Codebase Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Component Information
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Detailed specifications of the core modules powering the peer-to-peer architecture.
            </p>
          </div>

          {/* Components Grid */}
          <div className="space-y-6">
            {components.map((component, index) => {
              const Icon = component.icon
              const isExpanded = expandedSections[component.id]
              const activeTab = activeTabs[component.id] || 'overview'

              return (
                <Card
                  key={component.id}
                  className="animate-slide-up border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(component.id)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl shadow-inner border border-violet-100">
                          <Icon className="h-7 w-7 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-xl">{component.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs border-slate-200">
                              {component.category}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">{component.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 hover:bg-primary/10"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-6 animate-slide-down">
                      <Separator />

                      {/* Tabbed Content */}
                      <div className="w-full">
                        <div className="grid w-full grid-cols-4 lg:grid-cols-4 h-auto gap-2 mb-6">
                          {['overview', 'technical', 'code', 'how'].map(tab => (
                              <button
                                key={tab}
                                onClick={() => setTab(component.id, tab)}
                                className={cn(
                                    "flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                                    activeTab === tab ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                              >
                                {tab === 'overview' && <Eye className="w-4 h-4" />}
                                {tab === 'technical' && <Server className="w-4 h-4" />}
                                {tab === 'code' && <Code2 className="w-4 h-4" />}
                                {tab === 'how' && <Workflow className="w-4 h-4" />}
                                <span className="capitalize">{tab}</span>
                              </button>
                          ))}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-fade-in">
                            <div>
                                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Purpose
                                </h4>
                                <p className="text-muted-foreground leading-relaxed text-sm">{component.details.purpose}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Key Features
                                </h4>
                                <ul className="space-y-2">
                                {component.details.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            </div>
                        )}

                        {/* Technical Tab */}
                        {activeTab === 'technical' && (
                            <div className="space-y-4 animate-fade-in">
                            <div>
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                                <CircuitBoard className="h-4 w-4" />
                                Technical Specifications
                                </h4>
                                <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(component.details.technical).map(([key, value]) => (
                                    <div
                                    key={key}
                                    className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200"
                                    >
                                    <div className="font-medium text-sm capitalize mb-2 text-primary flex items-center gap-2">
                                        <Binary className="h-3 w-3" />
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">{value}</div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Related Files
                                </h4>
                                <ul className="space-y-2">
                                {component.details.files.map((file, fileIndex) => (
                                    <li
                                    key={fileIndex}
                                    className="text-sm font-mono bg-slate-50 p-3 rounded border border-slate-200 text-slate-600"
                                    >
                                    {file}
                                    </li>
                                ))}
                                </ul>
                            </div>
                            </div>
                        )}

                        {/* Code Examples Tab */}
                        {activeTab === 'code' && (
                            <div className="space-y-4 animate-fade-in">
                            <div>
                                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                                <Code2 className="h-4 w-4" />
                                Implementation Example
                                </h4>
                                <div className="relative">
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed border border-slate-800 font-mono">
                                    <code>{component.details.codeExample}</code>
                                </pre>
                                <Badge
                                    variant="secondary"
                                    className="absolute top-2 right-2 text-xs bg-slate-800 text-slate-200 border-none"
                                >
                                    TypeScript
                                </Badge>
                                </div>
                            </div>
                            </div>
                        )}

                        {/* How It Works Tab */}
                        {activeTab === 'how' && (
                            <div className="space-y-4 animate-fade-in">
                            <div>
                                <h4 className="font-semibold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2">
                                <Workflow className="h-4 w-4" />
                                Process Flow
                                </h4>
                                <div className="space-y-3">
                                {component.details.howItWorks.map((step, stepIndex) => (
                                    <div
                                    key={stepIndex}
                                    className="flex items-start gap-3 p-3 bg-teal-50/50 rounded-lg border border-teal-100"
                                    >
                                    <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                        {stepIndex + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-600 flex-1">{step}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                            </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          {/* System Architecture Overview */}
          <Card className="animate-slide-up border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Network className="h-6 w-6 text-primary" />
                System Architecture Overview
              </CardTitle>
              <CardDescription className="text-base">
                High-level overview of how all components work together.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Data Flow Pipeline
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      "Peer connection establishment via WebRTC handshake",
                      "File selection and chunking preparation (64KB chunks)",
                      "Encrypted chunk transfer via DataChannel with DTLS",
                      "Real-time progress and status updates to UI",
                      "File reassembly and SHA-256 integrity verification",
                      "Storage in IndexedDB with metadata and history",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Component Integration
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      "Event-driven architecture for real-time updates",
                      "Singleton Service for connection management",
                      "Automatic storage and analytics synchronization",
                      "Unified performance monitoring across all features",
                      "Centralized error handling and user notifications",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
