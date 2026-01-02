
import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Network,
  Shield,
  Zap,
  FileText,
  Users,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info,
  Code,
  Server,
  Lock,
  Settings,
  Layers,
  Globe,
  Wifi,
  HardDrive,
  MemoryStick,
  Gauge,
  GitBranch,
  Package,
  Workflow,
  Binary,
  Radio,
  CloudOff,
  Fingerprint,
  Key,
  ShieldCheck,
  Blocks,
  FileCode,
  FileStack,
  ArrowLeft,
  Boxes,
  Target,
  ArrowRightLeft,
  TriangleAlert,
  Activity,
  User
} from 'lucide-react';
import { Footer } from './Footer';
import { cn } from '../utils';

// Simple Badge Component
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants: any = {
    default: 'bg-dusk-100 dark:bg-dusk-800 text-dusk-800 dark:text-dusk-200 border-dusk-200 dark:border-dusk-700',
    outline: 'bg-transparent border-dusk-200 dark:border-dusk-700 text-dusk-600 dark:text-dusk-400 border',
    secondary: 'bg-dusk-50 dark:bg-dusk-900 text-dusk-600 dark:text-dusk-400 border-dusk-100 dark:border-dusk-800',
    destructive: 'bg-lcoral-50 dark:bg-lcoral-900/20 text-lcoral-700 dark:text-lcoral-300 border-lcoral-100 dark:border-lcoral-800',
    success: 'bg-rosewood-50 dark:bg-rosewood-900/20 text-rosewood-700 dark:text-rosewood-300 border-rosewood-100 dark:border-rosewood-800',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit", variants[variant], className)}>
      {children}
    </span>
  );
};

// Simple Card Components
const Card = ({ children, className }: any) => (
  <div className={cn("bg-white dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all", className)}>
    {children}
  </div>
);
const CardHeader = ({ children }: any) => <div className="p-6 pb-3">{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-3", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-lg font-bold text-dusk-900 dark:text-white", className)}>{children}</h3>;
const CardDescription = ({ children }: any) => <p className="text-sm text-dusk-500 dark:text-dusk-400 mt-1 leading-relaxed">{children}</p>;

export default function TechPage() {
  const [activeComponentTab, setActiveComponentTab] = useState(0);

  const coreComponents = [
    {
      name: "PeerService",
      file: "services/peerService.ts",
      purpose: "Manages the WebRTC connection lifecycle using PeerJS, handling signaling, connection states, and data transmission.",
      icon: Network,
      complexity: "High",
      linesOfCode: "~200 lines",
      dependencies: ["PeerJS Library", "WebRTC API"],
      keyContributions: [
        "Initializes the Peer instance with STUN/TURN configuration",
        "Manages active DataConnections in a Map<string, DataConnection>",
        "Handles ICE candidate gathering and connection states",
        "Provides a simplified API for the UI layer to connect/send",
        "Implements auto-reconnection logic for network interruptions",
      ],
      failureConsequences: [
        "Inability to discover peers or exchange handshakes",
        "Loss of real-time data transmission capabilities",
        "Application stuck in 'Connecting' state if signaling fails",
      ],
      technicalDetails: {
        pattern: "Singleton Service",
        transport: "SCTP over DTLS via UDP",
        natTraversal: "Google STUN (stun.l.google.com:19302)",
        signaling: "PeerJS Cloud (WebSocket)",
      },
    },
    {
      name: "Transfer Engine",
      file: "App.tsx (Logic)",
      purpose: "Orchestrates file chunking, binary transmission, and reassembly on the client side.",
      icon: Zap,
      complexity: "High",
      linesOfCode: "~300 lines (integrated)",
      dependencies: ["FileReader API", "Web Workers"],
      keyContributions: [
        "Reads files as ArrayBuffers using FileReader",
        "Slices files into 64KB chunks (configurable)",
        "Sends metadata header before binary payload",
        "Offloads chunking to Web Workers to prevent UI freezing",
        "Reconstructs Blob from received chunks array",
      ],
      failureConsequences: [
        "Corrupted files if chunk reassembly fails",
        "Browser freezes during large file processing (mitigated by Workers)",
        "Incorrect MIME types on download",
      ],
      technicalDetails: {
        chunkSize: "64KB (Default)",
        concurrency: "Web Worker Offloading",
        flowControl: "Implicit (SCTP Reliability)",
        integrity: "Size-check verification",
      },
    },
    {
      name: "Persistence Layer",
      file: "services/db.ts",
      purpose: "IndexedDB wrapper for storing received files and transfer logs persistently.",
      icon: Database,
      complexity: "Medium",
      linesOfCode: "~100 lines",
      dependencies: ["IndexedDB API"],
      keyContributions: [
        "Asynchronously stores large Blobs avoiding localStorage limits",
        "Implements 'files' object store with 'id' keyPath",
        "Handles 24-hour expiration logic (pruneExpiredFiles)",
        "Provides CRUD operations for the File History UI",
      ],
      failureConsequences: [
        "Loss of received file history upon page refresh",
        "Inability to re-download files after closing session",
        "Browser quota exceeded errors for huge transfers",
      ],
      technicalDetails: {
        dbName: "NWShareDB",
        version: "1",
        store: "files",
        expiry: "24-hour TTL",
      },
    },
    {
      name: "Storage Inspector",
      file: "components/StorageTab.tsx",
      purpose: "Visualizes browser storage usage across LocalStorage, SessionStorage, and IndexedDB.",
      icon: HardDrive,
      complexity: "Medium",
      linesOfCode: "~300 lines",
      dependencies: ["Navigator Storage API"],
      keyContributions: [
        "Estimates total quota and usage via navigator.storage.estimate()",
        "Iterates localStorage/sessionStorage to calculate string sizes",
        "Queries IndexedDB metadata to estimate database size",
        "Provides visual breakdown and cleanup controls",
      ],
      failureConsequences: [
        "User unaware of hitting browser storage limits",
        "Silent write failures when disk is full",
        "Lack of visibility into what data is persisting",
      ],
      technicalDetails: {
        api: "StorageManager API",
        updates: "Polled (10s interval)",
        estimation: "Approximation (UTF-16 string length)",
      },
    },
  ];

  const architectureLayers = [
    {
      name: "Presentation Layer",
      description: "React Components & Tailwind",
      icon: Monitor,
      components: [
        "App.tsx",
        "TransferList.tsx",
        "ChatTab.tsx",
        "ConnectionStatus.tsx",
      ],
      responsibilities: [
        "Rendering UI/UX",
        "Capturing User Input",
        "Visualizing Progress",
        "Displaying Toasts",
      ],
    },
    {
      name: "Logic Layer",
      description: "State & Coordination",
      icon: Cpu,
      components: [
        "App.tsx (Hooks)",
        "PeerService.ts",
        "Worker Scripts",
      ],
      responsibilities: [
        "Managing Connection State",
        "Queueing Files",
        "Processing Chunks",
        "Event Dispatching",
      ],
    },
    {
      name: "Data Layer",
      description: "Persistence & Storage",
      icon: Database,
      components: [
        "services/db.ts",
        "IndexedDB",
        "localStorage",
      ],
      responsibilities: [
        "Storing File Blobs",
        "Persisting Settings",
        "Saving Identity",
        "Logging Transfer History",
      ],
    },
    {
      name: "Network Layer",
      description: "P2P Transport",
      icon: Network,
      components: [
        "WebRTC DataChannel",
        "STUN Servers",
        "ICE Candidates",
      ],
      responsibilities: [
        "NAT Traversal",
        "Encryption (DTLS)",
        "Packet Transmission",
        "Connectivity Checks",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dusk-50 via-white to-lavender-50/20 dark:bg-black dark:bg-none">
      <header className="w-full px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-dusk-200 dark:border-dusk-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => window.location.hash = ''} 
              className="group flex items-center gap-3 px-4 py-2 rounded-full bg-dusk-50 dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 text-dusk-600 dark:text-dusk-300 font-bold hover:bg-dusk-900 hover:text-white hover:border-dusk-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
            >
                <div className="p-1 bg-white dark:bg-dusk-800 rounded-full border border-dusk-200 dark:border-dusk-700 group-hover:border-transparent group-hover:bg-white/20 text-dusk-400 dark:text-dusk-500 group-hover:text-white transition-colors">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                <span className="tracking-tight">Back to App</span>
            </button>
            <div className="font-black text-xl tracking-tighter text-dusk-900 dark:text-white">NW Architecture</div>
        </div>
      </header>

      <div className="flex-1 p-4 pt-8 md:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Educational Notice */}
          <div className="p-5 rounded-2xl border-2 border-bronze-100 dark:border-bronze-800/50 bg-bronze-50/50 dark:bg-bronze-900/10 flex flex-col sm:flex-row gap-4 animate-slide-up shadow-sm">
              <div className="p-3 bg-bronze-100 dark:bg-bronze-900/30 rounded-xl h-fit w-fit text-bronze-600 dark:text-bronze-400 flex-shrink-0 animate-pulse">
                  <TriangleAlert className="h-6 w-6" />
              </div>
              <div>
                  <h3 className="font-bold text-bronze-900 dark:text-bronze-100 text-lg mb-1">Architecture Overview</h3>
                  <p className="text-bronze-800/80 dark:text-bronze-200/80 text-sm leading-relaxed">
                      This application is a demonstration of <strong>serverless peer-to-peer architecture</strong>. 
                      It leverages the browser's native WebRTC capabilities for direct data transfer and IndexedDB for client-side persistence.
                      <br className="hidden sm:block mb-2" />
                      The system is designed to be ephemeral yet robust, relying on public STUN servers for initial signaling but maintaining zero knowledge of the data transferred.
                  </p>
              </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/20 text-lavender-700 dark:text-lavender-300 text-xs font-bold uppercase tracking-wider border border-transparent hover:border-lavender-300 transition-colors">
              <Code className="h-3 w-3" />
              System Version 2.4
            </div>
            <div className="relative inline-block">
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-lavender-600 to-dusk-600 dark:from-white dark:to-lavender-200 bg-clip-text text-transparent leading-tight pb-2">
                System Architecture
                </h1>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-bronze-400 to-lavender-500 rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-dusk-500 dark:text-dusk-400 max-w-3xl mx-auto leading-relaxed">
              A deep dive into the engineering behind NW Share. Built with React 19, PeerJS, and IndexedDB to deliver a fully decentralized file sharing experience.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            {[
                { label: "Core Service", value: "PeerJS", icon: Package, color: "text-lavender-600 dark:text-lavender-400", bg: "bg-lavender-50 dark:bg-lavender-900/20" },
                { label: "Storage Engine", value: "IndexedDB", icon: Database, color: "text-dusk-600 dark:text-dusk-400", bg: "bg-dusk-50 dark:bg-dusk-900/20" },
                { label: "Architecture", value: "Layered", icon: Layers, color: "text-rosewood-600 dark:text-rosewood-400", bg: "bg-rosewood-50 dark:bg-rosewood-900/20" },
                { label: "Security Protocol", value: "DTLS 1.2", icon: Shield, color: "text-lcoral-600 dark:text-lcoral-400", bg: "bg-lcoral-50 dark:bg-lcoral-900/20" },
            ].map((stat, i) => (
                <Card key={i} className="hover:border-lavender-200 dark:hover:border-lavender-800 group border-2 border-transparent">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-dusk-500 dark:text-dusk-400 font-medium group-hover:text-dusk-700 dark:group-hover:text-dusk-200 transition-colors">{stat.label}</p>
                            <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
                        </div>
                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>

          {/* Architecture Overview */}
          <Card className="animate-slide-up border-l-4 border-l-lavender-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-lavender-600 dark:text-lavender-400" />
                Layered Architecture
              </CardTitle>
              <CardDescription>
                Separation of concerns ensures maintainability and robust data handling across the stack.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {architectureLayers.map((layer, index) => {
                  const Icon = layer.icon
                  return (
                    <div key={index} className="space-y-4 p-5 border border-dusk-100 dark:border-dusk-800 bg-dusk-50/50 dark:bg-dusk-900/20 rounded-xl hover:border-lavender-200 dark:hover:border-lavender-800 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-dusk-800 rounded-lg shadow-sm border border-dusk-100 dark:border-dusk-700">
                          <Icon className="h-5 w-5 text-lavender-600 dark:text-lavender-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-dusk-800 dark:text-white text-sm">{layer.name}</h3>
                          <p className="text-[10px] text-dusk-400">{layer.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-dusk-700 dark:text-dusk-300 flex items-center gap-1">
                          <Boxes className="h-3 w-3" /> Modules
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.components.map((component, compIndex) => (
                            <Badge key={compIndex} variant="secondary" className="text-[10px] border-dusk-200 dark:border-dusk-700 bg-white dark:bg-dusk-800">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-dusk-700 dark:text-dusk-300 flex items-center gap-1">
                          <Target className="h-3 w-3" /> Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {layer.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="text-[10px] text-dusk-500 dark:text-dusk-400 flex items-start gap-2 leading-relaxed">
                              <div className="w-1 h-1 bg-lavender-400 rounded-full mt-1.5 flex-shrink-0" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Core Components Tabs */}
          <Card className="animate-slide-up border-l-4 border-l-dusk-500">
             <CardHeader>
                <CardTitle className="flex items-center gap-3">
                   <Package className="w-6 h-6 text-dusk-600 dark:text-dusk-400" /> Core Modules
                </CardTitle>
                <CardDescription>Detailed breakdown of critical system components.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex overflow-x-auto pb-4 gap-2 mb-6 custom-scrollbar">
                   {coreComponents.map((comp, i) => {
                      const Icon = comp.icon;
                      return (
                          <button 
                            key={i}
                            onClick={() => setActiveComponentTab(i)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border hover:scale-105 duration-200",
                                activeComponentTab === i 
                                  ? "bg-dusk-900 dark:bg-white text-white dark:text-dusk-900 border-dusk-900 dark:border-white shadow-lg shadow-dusk-900/20" 
                                  : "bg-white dark:bg-dusk-800 text-dusk-500 dark:text-dusk-300 border-dusk-200 dark:border-dusk-700 hover:bg-dusk-50 dark:hover:bg-dusk-700"
                            )}
                          >
                             <Icon className="w-4 h-4" /> {comp.name}
                          </button>
                      )
                   })}
                </div>

                <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
                    <div className="md:col-span-2 space-y-6">
                       <div className="flex items-start justify-between">
                          <div>
                             <h3 className="text-2xl font-black text-dusk-900 dark:text-white">{coreComponents[activeComponentTab].name}</h3>
                             <div className="flex items-center gap-2 mt-2 text-dusk-500 dark:text-dusk-400 font-mono text-sm">
                                <FileCode className="w-4 h-4" /> {coreComponents[activeComponentTab].file}
                             </div>
                          </div>
                          <Badge variant="destructive" className="px-3 py-1">{coreComponents[activeComponentTab].complexity} Complexity</Badge>
                       </div>

                       <div className="p-5 bg-dusk-50/80 dark:bg-dusk-900/50 rounded-xl border border-dusk-200 dark:border-dusk-800 text-sm text-dusk-700 dark:text-dusk-300 leading-relaxed shadow-inner">
                          <strong className="text-dusk-900 dark:text-white block mb-1">Purpose</strong> {coreComponents[activeComponentTab].purpose}
                       </div>

                       <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                             <h4 className="font-bold text-rosewood-600 dark:text-rosewood-400 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                <CheckCircle className="w-4 h-4" /> Key Functions
                             </h4>
                             <ul className="space-y-2">
                                {coreComponents[activeComponentTab].keyContributions.map((item, i) => (
                                   <li key={i} className="text-xs text-dusk-600 dark:text-dusk-400 flex gap-2 p-2 rounded bg-rosewood-50/50 dark:bg-rosewood-900/20 border border-rosewood-100/50 dark:border-rosewood-800/30">
                                      <div className="w-1.5 h-1.5 bg-rosewood-500 rounded-full mt-1 shrink-0" />
                                      {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <h4 className="font-bold text-lcoral-600 dark:text-lcoral-400 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" /> Risk Factors
                             </h4>
                             <ul className="space-y-2">
                                {coreComponents[activeComponentTab].failureConsequences.map((item, i) => (
                                   <li key={i} className="text-xs text-dusk-600 dark:text-dusk-400 flex gap-2 p-2 rounded bg-lcoral-50/50 dark:bg-lcoral-900/20 border border-lcoral-100/50 dark:border-lcoral-800/30">
                                      <div className="w-1.5 h-1.5 bg-lcoral-500 rounded-full mt-1 shrink-0" />
                                      {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    <div className="bg-dusk-950 text-dusk-300 rounded-2xl p-6 space-y-6 h-fit shadow-2xl shadow-dusk-900/20 border border-dusk-800">
                        <h4 className="font-bold text-white flex items-center gap-2 border-b border-dusk-800 pb-3">
                            <Binary className="w-5 h-5 text-lavender-400" /> Technical Specs
                        </h4>
                        <div className="space-y-4">
                           {Object.entries(coreComponents[activeComponentTab].technicalDetails).map(([key, val]: any, i) => (
                               <div key={i}>
                                  <div className="text-[10px] uppercase font-bold text-dusk-500 mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                                  <div className="text-xs leading-relaxed text-dusk-200 font-mono bg-dusk-900/50 p-2 rounded border border-dusk-800">{val}</div>
                               </div>
                           ))}
                        </div>
                        <div className="pt-4 border-t border-dusk-800">
                           <div className="text-[10px] uppercase font-bold text-dusk-500 mb-2">Dependencies</div>
                           <div className="flex flex-wrap gap-2">
                              {coreComponents[activeComponentTab].dependencies.map((dep, i) => (
                                 <span key={i} className="px-2 py-1 bg-dusk-900 text-lavender-300 rounded text-[10px] font-mono border border-dusk-800">{dep}</span>
                              ))}
                           </div>
                        </div>
                    </div>
                </div>
             </CardContent>
          </Card>

          {/* Deep Dive Sections - Massively Expanded */}
          <div className="space-y-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            
            {/* 1. Connection Lifecycle */}
            <Card className="border-l-4 border-l-dusk-500">
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                     <Activity className="h-6 w-6 text-dusk-500" />
                     Connection Lifecycle
                  </CardTitle>
                  <CardDescription>
                     Step-by-step breakdown of how two isolated peers establish a direct P2P link.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="relative border-l-2 border-dusk-100 dark:border-dusk-800 ml-4 pl-8 space-y-8 py-2">
                     {[
                        {
                           stage: "1. Initialization",
                           action: "Peer(id)",
                           desc: "Client connects to PeerJS signaling server via WebSocket. A unique 6-char ID is generated or regained from storage.",
                           tech: "WebSocket / HTTPS",
                           icon: User
                        },
                        {
                           stage: "2. Signaling (Offer/Answer)",
                           action: "SDP Exchange",
                           desc: "Initiator creates SDP Offer containing media capabilities. Receiver responds with SDP Answer. These are routed via the Signaling Server.",
                           tech: "Session Description Protocol (SDP)",
                           icon: Radio
                        },
                        {
                           stage: "3. ICE Candidate Gathering",
                           action: "STUN Lookup",
                           desc: "Both peers query Google's STUN server (stun.l.google.com) to discover their public IP:PORT mapping through NAT.",
                           tech: "Interactive Connectivity Establishment",
                           icon: Globe
                        },
                        {
                           stage: "4. P2P Handshake",
                           action: "DTLS Verification",
                           desc: "Direct UDP connection is attempted. DTLS handshake occurs to verify certificates and derive encryption keys.",
                           tech: "UDP / DTLS 1.2",
                           icon: ShieldCheck
                        },
                        {
                           stage: "5. DataChannel Open",
                           action: "SCTP Ready",
                           desc: "SCTP association is established over DTLS. The DataChannel 'open' event fires, allowing binary data flow.",
                           tech: "SCTP",
                           icon: Zap
                        }
                     ].map((step, i) => {
                        const Icon = step.icon;
                        return (
                           <div key={i} className="relative group">
                              <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-dusk-900 bg-dusk-300 dark:bg-dusk-600 group-hover:bg-lcoral-500 transition-colors" />
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-dusk-50/50 dark:bg-dusk-900/40 border border-dusk-100 dark:border-dusk-800 hover:border-dusk-300 dark:hover:border-dusk-600 transition-all">
                                 <div className="p-2 bg-white dark:bg-dusk-800 rounded-lg shadow-sm">
                                    <Icon className="w-5 h-5 text-dusk-600 dark:text-dusk-400" />
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                       <h4 className="font-bold text-dusk-900 dark:text-white">{step.stage}</h4>
                                       <Badge variant="outline" className="text-[10px] bg-white dark:bg-dusk-950 font-mono">{step.action}</Badge>
                                    </div>
                                    <p className="text-sm text-dusk-600 dark:text-dusk-400 leading-relaxed mb-2">{step.desc}</p>
                                    <div className="text-xs font-mono text-lavender-600 dark:text-lavender-400 bg-lavender-50 dark:bg-lavender-900/20 px-2 py-1 rounded w-fit">
                                       Protocol: {step.tech}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </CardContent>
            </Card>

            {/* 2. Security Architecture */}
            <Card className="border-l-4 border-l-rosewood-500">
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                     <Shield className="h-6 w-6 text-rosewood-500" />
                     Zero-Knowledge Security Architecture
                  </CardTitle>
                  <CardDescription>
                     We enforce a "Trust No One" model. The signaling server sees only IDs, never files.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <div className="bg-rosewood-50 dark:bg-rosewood-900/10 p-5 rounded-2xl border border-rosewood-100 dark:border-rosewood-800/30">
                           <h4 className="font-bold text-rosewood-800 dark:text-rosewood-200 mb-2 flex items-center gap-2">
                              <Lock className="w-4 h-4" /> End-to-End Encryption
                           </h4>
                           <p className="text-sm text-rosewood-700/80 dark:text-rosewood-300/80 leading-relaxed mb-4">
                              WebRTC mandates encryption. We utilize the <strong>DTLS 1.2</strong> (Datagram Transport Layer Security) protocol with <strong>AES-256-GCM</strong> cipher suites.
                           </p>
                           <ul className="space-y-2">
                              <li className="text-xs flex items-center gap-2 text-rosewood-700 dark:text-rosewood-400">
                                 <CheckCircle className="w-3 h-3" /> Ephemeral Keys (New per session)
                              </li>
                              <li className="text-xs flex items-center gap-2 text-rosewood-700 dark:text-rosewood-400">
                                 <CheckCircle className="w-3 h-3" /> Perfect Forward Secrecy
                              </li>
                              <li className="text-xs flex items-center gap-2 text-rosewood-700 dark:text-rosewood-400">
                                 <CheckCircle className="w-3 h-3" /> Integrity Checks (HMAC-SHA256)
                              </li>
                           </ul>
                        </div>
                        <div className="bg-dusk-50 dark:bg-dusk-900/30 p-5 rounded-2xl border border-dusk-100 dark:border-dusk-800">
                            <h4 className="font-bold text-dusk-800 dark:text-dusk-200 mb-2 flex items-center gap-2">
                              <CloudOff className="w-4 h-4" /> Server Blindness
                           </h4>
                           <p className="text-sm text-dusk-600 dark:text-dusk-400 leading-relaxed">
                              Our Signaling Server acts strictly as a "telephone switchboard". It connects Peer A to Peer B but lacks the capability to interpret the binary stream flowing through the DataChannel.
                           </p>
                        </div>
                     </div>
                     <div className="relative bg-dusk-900 rounded-2xl p-6 overflow-hidden border border-dusk-700">
                        <div className="absolute top-0 right-0 p-3 bg-dusk-800 rounded-bl-2xl border-b border-l border-dusk-700 text-xs font-mono text-dusk-400">
                           Security Model
                        </div>
                        <div className="mt-8 space-y-6">
                           <div className="flex items-center justify-between text-white">
                              <div className="text-center">
                                 <User className="w-8 h-8 text-lcoral-400 mx-auto mb-2" />
                                 <div className="text-xs font-bold">Alice</div>
                              </div>
                              <div className="flex-1 mx-4 relative h-1 bg-dusk-700 rounded-full">
                                 <div className="absolute inset-0 bg-gradient-to-r from-lcoral-500 via-purple-500 to-lavender-500 animate-pulse opacity-50" />
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-dusk-400 bg-dusk-900 px-2">
                                    DTLS Tunnel
                                 </div>
                              </div>
                              <div className="text-center">
                                 <User className="w-8 h-8 text-lavender-400 mx-auto mb-2" />
                                 <div className="text-xs font-bold">Bob</div>
                              </div>
                           </div>
                           
                           <div className="bg-black/50 p-3 rounded-lg border border-dusk-700/50 font-mono text-[10px] text-green-400 space-y-1">
                              <div>{`[SECURE] Handshake Complete`}</div>
                              <div>{`[CIPHER] TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`}</div>
                              <div>{`[KEY] Ephemeral Elliptic Curve Diffie-Hellman`}</div>
                              <div className="text-dusk-500">{`> Signaling Server cannot decrypt payload`}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* 3. Custom Protocol Specifications */}
            <Card className="border-l-4 border-l-bronze-500">
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                     <FileCode className="h-6 w-6 text-bronze-500" />
                     Binary Protocol Specification
                  </CardTitle>
                  <CardDescription>
                     We use a custom Application-Layer protocol over the WebRTC transport.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     <div className="grid md:grid-cols-3 gap-4">
                        {[
                           { type: "METADATA", desc: "JSON payload sent first. Contains filename, size, mime-type, and unique ID.", size: "< 1KB" },
                           { type: "CHUNK", desc: "Binary ArrayBuffer. The actual file content sliced into 64KB blocks.", size: "64KB" },
                           { type: "END", desc: "Termination signal. Triggers the receiver to compile the Blob.", size: "Few Bytes" }
                        ].map((p, i) => (
                           <div key={i} className="bg-bronze-50/50 dark:bg-bronze-900/10 p-4 rounded-xl border border-bronze-100 dark:border-bronze-800/30">
                              <div className="font-mono text-xs font-bold text-bronze-700 dark:text-bronze-300 mb-2 bg-bronze-100 dark:bg-bronze-900/50 w-fit px-2 py-1 rounded">
                                 {p.type}
                              </div>
                              <p className="text-xs text-dusk-600 dark:text-dusk-400 mb-2 h-10">{p.desc}</p>
                              <div className="text-[10px] text-bronze-500 font-bold uppercase tracking-wider">
                                 Avg Size: {p.size}
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="bg-dusk-900 rounded-xl p-5 border border-dusk-800 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="text-white font-mono text-sm">Protocol Schema (JSON)</h5>
                            <Badge variant="outline" className="text-xs border-dusk-600 text-dusk-400">v2.1</Badge>
                        </div>
                        <pre className="font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre-wrap">
{`// 1. Initial Handshake Message
{
  "type": "METADATA",
  "id": "uuid-v4",
  "fileName": "project_specs.pdf",
  "fileSize": 1450320, // bytes
  "fileType": "application/pdf",
  "timestamp": 17154210023
}

// 2. Data Stream (Serialized Binary)
// [ ... 64KB ArrayBuffer ... ]

// 3. Completion Signal
{
  "type": "END",
  "fileId": "uuid-v4"
}`}
                        </pre>
                     </div>
                  </div>
               </CardContent>
            </Card>

             {/* 4. Performance Optimization */}
             <Card className="border-l-4 border-l-lavender-500">
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                     <Gauge className="h-6 w-6 text-lavender-500" />
                     Performance Engineering
                  </CardTitle>
                  <CardDescription>
                     How we achieve near-native transfer speeds in the browser.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-lavender-50/50 dark:bg-lavender-900/10 border border-lavender-100 dark:border-lavender-800/30">
                          <h4 className="font-bold text-dusk-900 dark:text-white mb-2">Web Worker Offloading</h4>
                          <p className="text-sm text-dusk-600 dark:text-dusk-400">
                             File chunking and buffer processing happen on a background thread. This ensures the main UI thread never blocks, keeping animations smooth even during 2GB+ transfers.
                          </p>
                      </div>
                      <div className="p-4 rounded-xl bg-lavender-50/50 dark:bg-lavender-900/10 border border-lavender-100 dark:border-lavender-800/30">
                          <h4 className="font-bold text-dusk-900 dark:text-white mb-2">Zero-Copy Transfers</h4>
                          <p className="text-sm text-dusk-600 dark:text-dusk-400">
                             We utilize <code>Transferable Objects</code> when passing data between the Worker and Main thread, preventing expensive memory duplication operations.
                          </p>
                      </div>
                      <div className="p-4 rounded-xl bg-lavender-50/50 dark:bg-lavender-900/10 border border-lavender-100 dark:border-lavender-800/30">
                          <h4 className="font-bold text-dusk-900 dark:text-white mb-2">Backpressure Control</h4>
                          <p className="text-sm text-dusk-600 dark:text-dusk-400">
                             The transfer engine monitors the `bufferedAmount` of the DataChannel. If the network buffers fill up, we pause chunking until the queue drains, preventing packet loss.
                          </p>
                      </div>
                      <div className="p-4 rounded-xl bg-lavender-50/50 dark:bg-lavender-900/10 border border-lavender-100 dark:border-lavender-800/30">
                          <h4 className="font-bold text-dusk-900 dark:text-white mb-2">IndexedDB Persistence</h4>
                          <p className="text-sm text-dusk-600 dark:text-dusk-400">
                             Large files bypass RAM limits by streaming directly to IndexedDB blobs, allowing the browser to handle files larger than available system memory.
                          </p>
                      </div>
                  </div>
               </CardContent>
            </Card>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
