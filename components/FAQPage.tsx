
import React from 'react';
import {
  CircleHelp,
  Shield,
  Zap,
  CircleAlert,
  CircleCheck,
  Info,
  Settings,
  Lock,
  Database,
  Activity,
  Layers,
  Code,
  TriangleAlert,
  Boxes,
  ArrowLeft
} from "lucide-react";
import { Footer } from './Footer';
import { cn } from '../utils';

// Local components to replace shadcn/ui imports
const Card = ({ children, className, style }: any) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all", className)} style={style}>
    {children}
  </div>
);
const CardHeader = ({ children, className }: any) => <div className={cn("p-6 pb-3", className)}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-3", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-lg font-bold text-slate-900", className)}>{children}</h3>;

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      icon: CircleHelp,
      color: "text-blue-500",
      questions: [
        {
          q: "How do I start sharing files?",
          a: "Simply open the app, and you'll get a unique 6-character connection key generated using WebRTC peer ID system. Share this key with others through secure channels, or enter someone else's key to establish a direct peer-to-peer connection.",
          technical: "Uses PeerJS library with STUN/TURN servers for NAT traversal and ICE candidate gathering protocol",
        },
        {
          q: "Do I need to create an account?",
          a: "No account required! Just enter your name when you first open the app. Your session uses our advanced session persistence system that stores your identity in localStorage with 30-day expiration.",
          technical: "Session data cached with 10-second TTL, automatic cleanup of stale entries, and XSS sanitization",
        },
        {
          q: "What file types are supported?",
          a: "All file types are supported without restrictions - documents, images, videos, audio, archives, and more. Our transfer engine automatically detects MIME types and handles binary data transmission efficiently.",
          technical: "MIME type detection with extension validation, binary mode preference over Base64 when possible",
        },
        {
          q: "Is there a file size limit?",
          a: "No hard server-imposed limits! Our chunked transfer system breaks files into configurable segments allowing efficient transfer of files of any size, limited only by your browser's available memory.",
          technical: "Streaming with chunk buffering, automatic garbage collection triggers, ArrayBuffer pooling for performance",
        },
      ],
    },
    {
      category: "Security & Privacy",
      icon: Shield,
      color: "text-green-500",
      questions: [
        {
          q: "How secure are my file transfers?",
          a: "All transfers use WebRTC's built-in end-to-end encryption with DTLS 1.2 and AES-256-GCM cipher suites providing military-grade protection. Keys are generated per session and ensure perfect forward secrecy.",
          technical: "DTLS handshake with certificate verification, 2048-bit RSA certificates, AES-256-GCM authenticated encryption",
        },
        {
          q: "Are my files stored on servers?",
          a: "Absolutely not! Our zero-knowledge architecture ensures files transfer directly between peers via WebRTC DataChannels. We never store, see, or log your files. Our servers only facilitate initial peer discovery.",
          technical: "Pure P2P with direct DataChannel connections, automatic memory cleanup, zero data retention",
        },
        {
          q: "Can others intercept my connection key?",
          a: "Connection keys are session-specific identifiers that expire when you close your browser. They don't contain encryption material - actual data encryption happens via WebRTC's DTLS handshake.",
          technical: "Crypto API for secure random generation, session tokens with automatic expiration, no key reuse",
        },
      ],
    },
    {
      category: "Technical Details",
      icon: Zap,
      color: "text-yellow-500",
      questions: [
        {
          q: "Why is my transfer speed slow?",
          a: "Speed depends on network bandwidth, connection quality (NAT type), distance, and device performance. Our optimization system allows chunk size adjustment in settings to improve performance on different networks.",
          technical: "Network conditions affect DataChannel throughput, chunk size impacts overhead, CPU needed for chunking/crypto",
        },
        {
          q: "What if the connection drops?",
          a: "Our transfer engine implements automatic recovery. Failed chunks are identified and retried. If the connection cannot be re-established within a timeout, the transfer fails and must be restarted.",
          technical: "Chunk ACK tracking with timeout detection, exponential backoff reconnection (1s, 2s, 4s), no state recovery",
        },
        {
          q: "Can I connect to multiple people?",
          a: "Yes! Our system supports up to 10 simultaneous connections. You can send files to all peers (broadcast) or select specific recipients. Each connection is independently monitored.",
          technical: "Map<string, DataConnection> for peer storage, individual DataChannels per peer, concurrent transfer support",
        },
      ],
    },
    {
      category: "Troubleshooting",
      icon: CircleAlert,
      color: "text-red-500",
      questions: [
        {
          q: "I can't connect to someone.",
          a: "Check internet connection, verify the 6-character key, ensure no restrictive firewalls blocking UDP ports, and try disabling VPNs. Refreshing the page often resolves initialization issues.",
          technical: "Common failures: symmetric NAT (requires TURN), blocked UDP, WebRTC disabled, CORS issues",
        },
        {
          q: "Files aren't downloading automatically.",
          a: "Check if auto-download is enabled in settings (disabled by default). Also verify browser download permissions and popup blockers.",
          technical: "Blob URL downloads with download attribute, browser download permissions, popup blocker interference",
        },
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
            <div className="font-black text-xl tracking-tighter text-slate-900">NW Help</div>
        </div>
      </header>

      <div className="flex-1 p-4 pt-8 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
              <CircleHelp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-4xl mx-auto leading-relaxed">
              Find detailed answers about NW Share's P2P file sharing system, security, and features.
            </p>
          </div>

          {/* Educational Notice - Animated Point Wise */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-300 group animate-fade-in">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/50 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-amber-100 text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <TriangleAlert className="h-6 w-6 animate-pulse" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-amber-900 tracking-tight">Educational Project Notice</h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">Important</span>
                      </div>
                      
                      <ul className="space-y-2.5">
                          {[
                              "This application demonstrates client-side WebRTC & IndexedDB technologies for educational purposes.",
                              "Security relies on standard WebRTC encryption (DTLS/SRTP) but lacks enterprise-grade auditing.",
                              "Do not use for classified, highly sensitive, PII, or regulated data transfer.",
                              "Data persistence is local to your browser/device and is not stored on any central server."
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

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
             {[
               { label: "Questions", value: "12+", icon: CircleHelp, color: "text-blue-600", bg: "bg-blue-50" },
               { label: "Topics", value: "4", icon: Layers, color: "text-violet-600", bg: "bg-violet-50" },
               { label: "Technical", value: "Deep Dive", icon: Code, color: "text-emerald-600", bg: "bg-emerald-50" },
               { label: "Security", value: "Verified", icon: Shield, color: "text-rose-600", bg: "bg-rose-50" }
             ].map((stat, i) => (
               <Card key={i} className="hover:border-blue-200">
                 <CardContent className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                     <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
                   </div>
                   <div className={cn("p-3 rounded-2xl", stat.bg)}>
                     <stat.icon className={cn("w-6 h-6", stat.color)} />
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <div className={cn("p-3 rounded-2xl bg-slate-50")}>
                      <CategoryIcon className={cn("h-8 w-8", category.color)} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{category.category}</h2>
                      <p className="text-sm text-slate-500">{category.questions.length} questions</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {category.questions.map((faq, faqIndex) => (
                      <Card
                        key={faqIndex}
                        className="border-2 hover:border-violet-200 transition-all duration-300 hover:shadow-lg"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-start gap-2 leading-tight">
                            <CircleHelp className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                            {faq.q}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                          {faq.technical && (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="flex gap-2">
                                <Code className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-500 leading-relaxed">
                                  <span className="font-bold text-violet-600">Technical:</span> {faq.technical}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
