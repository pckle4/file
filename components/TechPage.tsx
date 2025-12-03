
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
  TriangleAlert
} from 'lucide-react';
import { Footer } from './Footer';
import { cn } from '../utils';

// Simple Badge Component
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants: any = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-transparent border-slate-200 text-slate-600 border',
    secondary: 'bg-slate-50 text-slate-600 border-slate-100',
    destructive: 'bg-red-50 text-red-700 border-red-100',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit", variants[variant], className)}>
      {children}
    </span>
  );
};

// Simple Card Components
const Card = ({ children, className }: any) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all", className)}>
    {children}
  </div>
);
const CardHeader = ({ children }: any) => <div className="p-6 pb-3">{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-3", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-lg font-bold text-slate-900", className)}>{children}</h3>;
const CardDescription = ({ children }: any) => <p className="text-sm text-slate-500 mt-1 leading-relaxed">{children}</p>;

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/20">
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
            <div className="font-black text-xl tracking-tighter text-slate-900">NW Architecture</div>
        </div>
      </header>

      <div className="flex-1 p-4 pt-8 md:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Educational Notice */}
          <div className="p-5 rounded-2xl border-2 border-amber-100 bg-amber-50/50 flex flex-col sm:flex-row gap-4 animate-slide-up shadow-sm">
              <div className="p-3 bg-amber-100 rounded-xl h-fit w-fit text-amber-600 flex-shrink-0 animate-pulse">
                  <TriangleAlert className="h-6 w-6" />
              </div>
              <div>
                  <h3 className="font-bold text-amber-900 text-lg mb-1">Architecture Overview</h3>
                  <p className="text-amber-800/80 text-sm leading-relaxed">
                      This application is a demonstration of <strong>serverless peer-to-peer architecture</strong>. 
                      It leverages the browser's native WebRTC capabilities for direct data transfer and IndexedDB for client-side persistence.
                      <br className="hidden sm:block mb-2" />
                      The system is designed to be ephemeral yet robust, relying on public STUN servers for initial signaling but maintaining zero knowledge of the data transferred.
                  </p>
              </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <Code className="h-3 w-3" />
              System Version 2.4
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              System Architecture
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              A deep dive into the engineering behind NW Share. Built with React 19, PeerJS, and IndexedDB to deliver a fully decentralized file sharing experience.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            {[
                { label: "Core Service", value: "PeerJS", icon: Package, color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Storage Engine", value: "IndexedDB", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Architecture", value: "Layered", icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Security Protocol", value: "DTLS 1.2", icon: Shield, color: "text-rose-600", bg: "bg-rose-50" },
            ].map((stat, i) => (
                <Card key={i} className="hover:border-violet-200 group">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">{stat.label}</p>
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
          <Card className="animate-slide-up border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-violet-600" />
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
                    <div key={index} className="space-y-4 p-5 border border-slate-100 bg-slate-50/50 rounded-xl hover:border-violet-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                          <Icon className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{layer.name}</h3>
                          <p className="text-[10px] text-slate-400">{layer.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Boxes className="h-3 w-3" /> Modules
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.components.map((component, compIndex) => (
                            <Badge key={compIndex} variant="secondary" className="text-[10px] border-slate-200 bg-white">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Target className="h-3 w-3" /> Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {layer.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
                              <div className="w-1 h-1 bg-violet-400 rounded-full mt-1.5 flex-shrink-0" />
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
          <Card className="animate-slide-up border-l-4 border-l-blue-500">
             <CardHeader>
                <CardTitle className="flex items-center gap-3">
                   <Package className="w-6 h-6 text-blue-600" /> Core Modules
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
                                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" 
                                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
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
                             <h3 className="text-2xl font-black text-slate-900">{coreComponents[activeComponentTab].name}</h3>
                             <div className="flex items-center gap-2 mt-2 text-slate-500 font-mono text-sm">
                                <FileCode className="w-4 h-4" /> {coreComponents[activeComponentTab].file}
                             </div>
                          </div>
                          <Badge variant="destructive" className="px-3 py-1 bg-slate-100 border-slate-200 text-slate-600">{coreComponents[activeComponentTab].complexity} Complexity</Badge>
                       </div>

                       <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-inner">
                          <strong className="text-slate-900 block mb-1">Purpose</strong> {coreComponents[activeComponentTab].purpose}
                       </div>

                       <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                             <h4 className="font-bold text-emerald-600 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                <CheckCircle className="w-4 h-4" /> Key Functions
                             </h4>
                             <ul className="space-y-2">
                                {coreComponents[activeComponentTab].keyContributions.map((item, i) => (
                                   <li key={i} className="text-xs text-slate-600 flex gap-2 p-2 rounded bg-emerald-50/50 border border-emerald-100/50">
                                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                                      {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <h4 className="font-bold text-red-600 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" /> Risk Factors
                             </h4>
                             <ul className="space-y-2">
                                {coreComponents[activeComponentTab].failureConsequences.map((item, i) => (
                                   <li key={i} className="text-xs text-slate-600 flex gap-2 p-2 rounded bg-red-50/50 border border-red-100/50">
                                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 shrink-0" />
                                      {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 space-y-6 h-fit shadow-2xl shadow-slate-900/20">
                        <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
                            <Binary className="w-5 h-5 text-violet-400" /> Technical Specs
                        </h4>
                        <div className="space-y-4">
                           {Object.entries(coreComponents[activeComponentTab].technicalDetails).map(([key, val]: any, i) => (
                               <div key={i}>
                                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                                  <div className="text-xs leading-relaxed text-slate-200 font-mono bg-slate-800/50 p-2 rounded border border-slate-700">{val}</div>
                               </div>
                           ))}
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                           <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Dependencies</div>
                           <div className="flex flex-wrap gap-2">
                              {coreComponents[activeComponentTab].dependencies.map((dep, i) => (
                                 <span key={i} className="px-2 py-1 bg-slate-800 text-violet-300 rounded text-[10px] font-mono border border-slate-700">{dep}</span>
                              ))}
                           </div>
                        </div>
                    </div>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
}
