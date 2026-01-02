
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
  TriangleAlert,
  Palette,
  Zap
} from "lucide-react"
import { Footer } from "./Footer"
import { cn } from "../utils"

// Reusable UI Components for this page
const Card = ({ children, className }: any) => (
  <div className={cn("bg-white dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg shadow-dusk-200/50 dark:shadow-dusk-900/50 transition-all", className)}>
    {children}
  </div>
);
const CardHeader = ({ children, className }: any) => <div className={cn("p-6 pb-3", className)}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-3", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-lg font-bold text-dusk-900 dark:text-white", className)}>{children}</h3>;
const CardDescription = ({ children, className }: any) => <p className="text-sm text-dusk-500 dark:text-dusk-400 mt-1 leading-relaxed">{children}</p>;

const Badge = ({ children, variant = 'default', className }: any) => {
  const variants: any = {
    default: 'bg-dusk-50 dark:bg-dusk-800 text-dusk-700 dark:text-dusk-300 border-dusk-200 dark:border-dusk-700',
    outline: 'bg-transparent border-dusk-200 dark:border-dusk-700 text-dusk-600 dark:text-dusk-400 border',
    secondary: 'bg-lavender-50 dark:bg-lavender-900/20 text-lavender-700 dark:text-lavender-300 border-lavender-100 dark:border-lavender-800',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit", variants[variant], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'default', size = 'default', onClick, className }: any) => {
    const variants: any = {
        default: 'bg-dusk-900 dark:bg-white text-white dark:text-dusk-900 hover:bg-dusk-800 dark:hover:bg-dusk-100',
        ghost: 'bg-transparent hover:bg-dusk-50 dark:hover:bg-dusk-800 text-dusk-600 dark:text-dusk-400',
        outline: 'border border-dusk-200 dark:border-dusk-700 bg-white dark:bg-dusk-900 hover:bg-dusk-50 dark:hover:bg-dusk-800 text-dusk-900 dark:text-white'
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

const Separator = () => <div className="h-[1px] w-full bg-dusk-100 dark:bg-dusk-800 my-4" />;

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
      description: "Singleton orchestrator managing the complete WebRTC connection lifecycle and signaling.",
      icon: Network, // Modernized from Users
      category: "Core Logic",
      details: {
        purpose:
          "Establishes and manages secure, decentralized WebRTC connections between peers. It abstracts the complexity of ICE candidate exchange, error recovery, and event dispatching, serving as the nervous system of the application.",
        features: [
          "Singleton instance for application-wide access",
          "Automatic connection recovery with exponential backoff",
          "Real-time event dispatching (onConnectionChange, onDataReceived)",
          "Smart ICE server selection (STUN/TURN) for NAT traversal",
          "Resource cleanup and memory management on disconnect",
        ],
// ... existing technical/code/files ...
        technical: {
          library: "PeerJS (v1.5+)",
          protocol: "WebRTC DataChannel (SCTP)",
          transport: "UDP with DTLS Security",
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
          "PeerService connects to the signaling server via WebSocket.",
          "When connecting, it creates a DataChannel for high-performance transmission.",
          "Events (open, data, close) are forwarded to the UI via optimized callbacks.",
        ],
      },
    },
    {
      id: "transfer-logic",
      title: "Transfer Engine",
      description: "High-performance binary transfer protocol with Web Worker offloading.",
      icon: Zap, // Modernized from Upload
      category: "Core Logic",
      details: {
        purpose:
          "Handles the complex process of reading files, slicing them into optimal chunks (64KB), and streaming them over the network. It uses Web Workers to ensure the UI remains buttery smooth even during gigabyte-scale transfers.",
        features: [
          "Smart Chunking (64KB default) for optimal throughput",
          "Web Worker offloading for non-blocking UI",
          "Real-time progress calculation and transfer speed tracking",
          "Blob reassembly from binary streams",
          "Custom Protocol headers (METADATA, CHUNK, END)",
        ],
        technical: {
          chunking: "FileReader.readAsArrayBuffer + slice()",
          concurrency: "Dedicated Web Workers",
          reassembly: "InMemory ArrayBuffer[] Buffer",
          protocol: "JSON Protocol Header + Binary Payload",
        },
        codeExample: `// Worker processing a file chunk
self.onmessage = async function(e) {
  const { file, chunkSize } = e.data;
  let offset = 0;
  
  while (offset < file.size) {
     const chunk = file.slice(offset, offset + chunkSize);
     const buffer = await chunk.arrayBuffer();
     // Zero-copy transfer of buffer to main thread
     self.postMessage({ type: 'CHUNK', data: buffer }, [buffer]); 
     offset += chunkSize;
  }
  self.postMessage({ type: 'END' });
};`,
        files: [
          "App.tsx (handleIncomingData, sendFileToPeer)",
          "components/TransferList.tsx",
        ],
        howItWorks: [
          "Sender transmits METADATA payload with file attributes.",
          "Web Worker slices file into binary chunks to prevent UI freeze.",
          "Chunks are streamed via DataChannel with backpressure control.",
          "Receiver buffers chunks in RAM until completion.",
          "Final integrity check runs before Blob generation.",
        ],
      },
    },
    {
      id: "storage-layer",
      title: "Persistence Layer", // Renamed for tech feel
      description: "IndexedDB-powered client-side storage for large file retention.",
      icon: HardDrive, // Modernized from Database
      category: "Data Layer",
      details: {
        purpose:
          "Provides robust persistent storage for received files. Unlike localStorage (capped at ~5MB), IndexedDB allows storing gigabytes of Blob data directly in the browser, enabling a true 'download later' experience.",
        features: [
          "Asynchronous non-blocking I/O operations",
          "Direct Blob storage without Base64 overhead",
          "Auto-pruning mechanism (24h TTL)",
          "Storage quota management and awareness",
        ],
        technical: {
          api: "IndexedDB API",
          dbName: "NWShareDB",
          storeName: "files (keyPath: id)",
          transaction: "readwrite / readonly",
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
          "Database initializes asynchronously on app boot.",
          "Received Blobs are directly committed to object store.",
          "Metadata allows for quick listing without loading full binaries.",
          "Cleanup routine purges expired records automatically.",
        ],
      },
    },
    {
      id: "ui-components",
      title: "Interface System", // Renamed
      description: "Atomic, Tailwind-styled component library with dark mode support.",
      icon: Palette, // Changed from Layers. Note: Need to import Palette
      category: "UI/UX",
      details: {
        purpose:
          "A comprehensive design system implemented as modular React components. It enforces consistency in spacing, typography, and interactive states while fully supporting the app's dynamic theme switching.",
        features: [
          "Responsive Grid & Flex Layouts",
          "Animated Transitions (Framer Motion)",
          "Smart File Type Iconography",
          "Context-aware Toast Notification System",
          "Accessible Modal Dialogs",
        ],
        technical: {
          framework: "React Functional Components",
          styling: "Tailwind CSS + Custom Config",
          icons: "Lucide React Vector Icons",
        },
        codeExample: `export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', ...props 
}) => {
  return (
    <button 
      className={cn(
        "rounded-xl font-medium transition-all duration-200",
        variant === 'primary' 
          ? "bg-gradient-to-r from-dusk-600 to-dusk-500 text-white shadow-lg" 
          : "bg-white hover:bg-gray-50",
        "active:scale-95 focus:ring-2"
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
          "Components accept strictly typed props for data flow.",
          "Tailwind utility classes handle responsive & dark states.",
          "Utility function 'cn' manages class merging safely.",
        ],
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-dusk-200 dark:border-dusk-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => window.location.hash = ''} 
              className="group flex items-center gap-3 px-4 py-2 rounded-full bg-dusk-50 dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-800 text-dusk-600 dark:text-dusk-300 font-bold hover:bg-dusk-900 hover:text-white hover:border-dusk-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
            >
                <div className="p-1 bg-white dark:bg-black rounded-full border border-dusk-200 dark:border-dusk-700 group-hover:border-transparent group-hover:bg-white/20 text-dusk-400 dark:text-dusk-500 group-hover:text-white transition-colors">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                <span className="tracking-tight">Back to App</span>
            </button>
            <div className="font-black text-xl tracking-tighter text-dusk-900 dark:text-white">NW Component Info</div>
        </div>
      </header>

      <main className="flex-1 pt-10 px-4 pb-12 bg-gradient-to-br from-dusk-50 via-white to-lavender-50/20 dark:bg-black dark:bg-none">
        <div className="max-w-6xl mx-auto space-y-8">
          
           {/* Educational Notice - Animated Point Wise */}
          <div className="relative overflow-hidden rounded-2xl border border-bronze-200 dark:border-bronze-800 bg-bronze-50/80 dark:bg-bronze-900/20 p-6 shadow-sm transition-all hover:shadow-md hover:border-bronze-300 dark:hover:border-bronze-700 group animate-fade-in">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bronze-100/50 dark:bg-bronze-800/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-bronze-950 border border-bronze-100 dark:border-bronze-800 text-bronze-600 dark:text-bronze-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <TriangleAlert className="h-6 w-6 animate-pulse" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-bronze-900 dark:text-bronze-100 tracking-tight">Architecture Overview</h3>
                          <span className="px-2 py-0.5 rounded-full bg-bronze-100 dark:bg-bronze-900 text-bronze-700 dark:text-bronze-300 text-[10px] font-bold uppercase tracking-wider border border-bronze-200 dark:border-bronze-800">Important</span>
                      </div>
                      
                      <ul className="space-y-2.5">
                          {[
                              "This application leverages a purely client-side architecture using WebRTC and IndexedDB.",
                              "It follows a Singleton Service pattern for managing peer connections.",
                              "Data flow is unidirectional during file transfers, utilizing a custom chunking protocol.",
                              "UI updates are event-driven, ensuring real-time feedback without polling."
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-bronze-800/80 dark:text-bronze-200/80">
                                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-bronze-500 shadow-sm" />
                                  <span className="leading-relaxed">{item}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>

          {/* Header Section */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-dusk-100 dark:bg-dusk-900/50 rounded-full border border-dusk-200 dark:border-dusk-800 mb-4 hover:border-lavender-400 transition-colors cursor-default">
              <Info className="h-4 w-4 text-dusk-600 dark:text-dusk-400" />
              <span className="text-sm font-medium text-dusk-700 dark:text-dusk-300">Codebase Documentation</span>
            </div>
            <div className="relative inline-block">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-dusk-600 via-lavender-600 to-dusk-600 dark:from-white dark:via-lavender-200 dark:to-white bg-clip-text text-transparent leading-tight pb-2">
                Component Information
                </h1>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-lcoral-400 to-rosewood-500 rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-dusk-500 dark:text-dusk-400 max-w-3xl mx-auto leading-relaxed">
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
                  className="animate-slide-up border-2 border-transparent hover:border-dusk-200 dark:hover:border-dusk-700 transition-all duration-300 hover:shadow-xl dark:bg-dusk-900"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(component.id)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-br from-lavender-100 to-dusk-100 dark:from-lavender-900/20 dark:to-dusk-900/20 rounded-xl shadow-inner border border-lavender-100 dark:border-lavender-800/30">
                          <Icon className="h-7 w-7 text-lavender-600 dark:text-lavender-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-xl">{component.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs border-dusk-200 dark:border-dusk-700">
                              {component.category}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">{component.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 hover:bg-dusk-100 dark:hover:bg-dusk-800"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-dusk-600 dark:text-dusk-400" />
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
                                    activeTab === tab ? "bg-dusk-900 dark:bg-dusk-700 text-white shadow-md shadow-dusk-200 dark:shadow-none" : "bg-dusk-100 dark:bg-dusk-800 text-dusk-600 dark:text-dusk-400 hover:bg-dusk-200 dark:hover:bg-dusk-700"
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
                                <h4 className="font-semibold text-dusk-700 dark:text-dusk-300 mb-2 flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Purpose
                                </h4>
                                <p className="text-dusk-500 dark:text-dusk-400 leading-relaxed text-sm">{component.details.purpose}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-rosewood-600 dark:text-rosewood-400 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Key Features
                                </h4>
                                <ul className="space-y-2">
                                {component.details.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-dusk-600 dark:text-dusk-400">
                                    <CheckCircle className="h-4 w-4 text-rosewood-500 mt-0.5 flex-shrink-0" />
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
                                <h4 className="font-semibold text-dusk-600 dark:text-dusk-400 mb-3 flex items-center gap-2">
                                <CircuitBoard className="h-4 w-4" />
                                Technical Specifications
                                </h4>
                                <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(component.details.technical).map(([key, value]) => (
                                    <div
                                    key={key}
                                    className="p-4 bg-gradient-to-br from-dusk-50 to-white dark:from-dusk-800 dark:to-dusk-900 rounded-lg border border-dusk-200 dark:border-dusk-700"
                                    >
                                    <div className="font-medium text-sm capitalize mb-2 text-dusk-800 dark:text-dusk-300 flex items-center gap-2">
                                        <Binary className="h-3 w-3 text-lavender-500" />
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </div>
                                    <div className="text-xs text-dusk-500 dark:text-dusk-400 leading-relaxed">{value}</div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lavender-600 dark:text-lavender-400 mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Related Files
                                </h4>
                                <ul className="space-y-2">
                                {component.details.files.map((file, fileIndex) => (
                                    <li
                                    key={fileIndex}
                                    className="text-sm font-mono bg-dusk-50 dark:bg-dusk-800 p-3 rounded border border-dusk-200 dark:border-dusk-700 text-dusk-600 dark:text-dusk-300"
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
                                <h4 className="font-semibold text-bronze-600 dark:text-bronze-400 mb-3 flex items-center gap-2">
                                <Code2 className="h-4 w-4" />
                                Implementation Example
                                </h4>
                                <div className="relative">
                                <pre className="bg-dusk-950 text-dusk-50 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed border border-dusk-800 font-mono">
                                    <code>{component.details.codeExample}</code>
                                </pre>
                                <Badge
                                    variant="secondary"
                                    className="absolute top-2 right-2 text-xs bg-dusk-800 text-dusk-200 border-none"
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
                                <h4 className="font-semibold text-lcoral-600 dark:text-lcoral-400 mb-3 flex items-center gap-2">
                                <Workflow className="h-4 w-4" />
                                Process Flow
                                </h4>
                                <div className="space-y-3">
                                {component.details.howItWorks.map((step, stepIndex) => (
                                    <div
                                    key={stepIndex}
                                    className="flex items-start gap-3 p-3 bg-lcoral-50/50 dark:bg-lcoral-900/20 rounded-lg border border-lcoral-100 dark:border-lcoral-800"
                                    >
                                    <div className="flex-shrink-0 w-6 h-6 bg-lcoral-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                        {stepIndex + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed text-dusk-600 dark:text-dusk-300 flex-1">{step}</p>
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
          <Card className="animate-slide-up border-2 border-transparent hover:border-dusk-200 dark:hover:border-dusk-700 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Network className="h-6 w-6 text-dusk-600 dark:text-dusk-300" />
                System Architecture Overview
              </CardTitle>
              <CardDescription className="text-base">
                High-level overview of how all components work together.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-rosewood-600 dark:text-rosewood-400 mb-3 flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Data Flow Pipeline
                  </h4>
                  <ul className="space-y-2 text-sm text-dusk-600 dark:text-dusk-400">
                    {[
                      "Peer connection establishment via WebRTC handshake",
                      "File selection and chunking preparation (64KB chunks)",
                      "Encrypted chunk transfer via DataChannel with DTLS",
                      "Real-time progress and status updates to UI",
                      "File reassembly and SHA-256 integrity verification",
                      "Storage in IndexedDB with metadata and history",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-rosewood-500 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-dusk-600 dark:text-dusk-400 mb-3 flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Component Integration
                  </h4>
                  <ul className="space-y-2 text-sm text-dusk-600 dark:text-dusk-400">
                    {[
                      "Event-driven architecture for real-time updates",
                      "Singleton Service for connection management",
                      "Automatic storage and analytics synchronization",
                      "Unified performance monitoring across all features",
                      "Centralized error handling and user notifications",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-dusk-500 flex-shrink-0" />
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
