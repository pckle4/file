
import React, { useState } from "react"
import {
  Users,
  Upload,
  Download,
  Wifi,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Lock,
  Server,
  Smartphone,
  Monitor,
  Tablet,
  Network,
  Key,
  Link,
  Activity,
  Database,
  Cpu,
  HardDrive,
  Signal,
  Eye,
  Settings,
  BarChart3,
  FileImage,
  Boxes,
  Target,
  Gauge,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Router,
  CloudOff,
  Fingerprint,
  Layers,
  Maximize2,
  MemoryStick,
  Timer,
  ArrowLeft,
  Scan,
  MessageSquare,
  TriangleAlert
} from "lucide-react"
import { Footer } from "@/components/Footer"
import { cn } from "../utils"

// Reusable UI Components
const Card = ({ children, className, style }: any) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all", className)} style={style}>
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

const Separator = ({ className }: any) => <div className={cn("h-[1px] w-full bg-slate-100 my-4", className)} />;

const Alert = ({ children, className }: any) => (
  <div className={cn("p-4 rounded-xl border flex items-start gap-3", className)}>
    {children}
  </div>
);

const AlertDescription = ({ children, className }: any) => (
  <div className={cn("text-sm", className)}>
    {children}
  </div>
);

export default function HowToPage() {
  const [activeTab, setActiveTab] = useState('issue-0');

  const steps = [
    {
      title: "Establish Connection",
      description: "Generate your unique peer identity or connect to an existing peer.",
      icon: Scan,
      details: [
        "Your 6-character connection key is automatically generated on start.",
        "Share this key with peers securely (e.g., via signal/whatsapp).",
        "Enter a peer's 6-digit key in the input box to initiate connection.",
        "The connection status box will update to show active peers.",
        "You can connect to up to 10 peers simultaneously.",
      ],
      technical: "Uses PeerJS to broker a WebRTC DataChannel connection via public STUN servers.",
      tips: [
        "Click the copy button to quickly share your ID.",
        "Wait for the green 'Connected' indicator before sending.",
      ],
    },
    {
      title: "Share Files",
      description: "Drag & drop files or use the file picker to start transferring.",
      icon: Upload,
      details: [
        "Drag files directly onto the 'Share Files' card.",
        "Use the 'Create' button to make text/code files instantly.",
        "Files are added to a queue before sending.",
        "Choose to send to 'Everyone' or specific connected peers.",
        "Supports all file types: Images, Videos, Code, Archives.",
      ],
      technical: "Files are read as ArrayBuffers and chunked (64KB) for reliable UDP transmission.",
      tips: [
        "You can queue multiple files at once.",
        "Use the floating bar at the bottom to confirm sending.",
      ],
    },
    {
      title: "Manage & Chat",
      description: "Interact with connected peers and manage your session.",
      icon: MessageSquare,
      details: [
        "Use the 'Chat' tab to send text messages to peers.",
        "Monitor transfer progress in real-time.",
        "Received files appear in the 'History' tab.",
        "Use the 'Peers' tab to disconnect specific users.",
        "System messages will alert you of joins/leaves.",
      ],
      technical: "Chat messages travel over the same secure DataChannel as files.",
      tips: [
        "Chat is ephemeral; history clears on refresh.",
        "Click 'Disconnect' on a peer card to close that connection.",
      ],
    },
    {
      title: "Storage & History",
      description: "Access received files and manage browser storage.",
      icon: Database,
      details: [
        "Received files are stored in IndexedDB for persistence.",
        "Files persist for 24 hours before auto-expiry.",
        "Use the 'Storage' tab to view disk usage.",
        "Manually delete files or clear all storage if needed.",
        "Files in the main view are session-specific.",
      ],
      technical: "Large files are stored as Blobs in IndexedDB to avoid memory limits.",
      tips: [
        "Enable 'Auto Download' in settings for faster saving.",
        "Check the Storage tab to free up space.",
      ],
    },
  ];

  const troubleshooting = [
    {
      issue: "Stuck on 'Connecting...'",
      icon: XCircle,
      severity: "high",
      solutions: [
        "Ensure both peers are online and the ID is correct.",
        "Try refreshing the page to get a clean session.",
        "Check if you are on a restrictive corporate network (firewall).",
        "Disable VPNs that might block UDP traffic.",
      ],
      prevention: [
        "Use a standard home or mobile network.",
        "Keep the tab active during connection.",
      ],
    },
    {
      issue: "Transfer Fails Mid-way",
      icon: AlertTriangle,
      severity: "medium",
      solutions: [
        "Check the 'Peers' tab to see if the connection dropped.",
        "Try reducing the 'Chunk Size' in settings to 16KB.",
        "Ensure the receiving device has enough disk space.",
        "Keep the browser window in focus on mobile devices.",
      ],
      prevention: [
        "Avoid transferring huge files on unstable networks.",
        "Use the Reconnection Modal if prompted.",
      ],
    },
    {
      issue: "Browser Memory Full",
      icon: HardDrive,
      severity: "medium",
      solutions: [
        "Go to the 'Storage' tab and click 'Clear Storage'.",
        "Delete large files from the 'History' tab.",
        "Restart the browser to clear RAM buffers.",
      ],
      prevention: [
        "Regularly clean up received files.",
        "Monitor usage in the Analytics tab.",
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
            <div className="font-black text-xl tracking-tighter text-slate-900">NW Guide</div>
        </div>
      </header>

      <div className="flex-1 p-4 pt-8 md:p-8">
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

          {/* Hero Section */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">User Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              How to Use NW Share
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Secure, direct, and simple. Learn how to establish connections and share files without intermediaries.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <Card
                    key={index}
                    className="animate-bounce-in border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                          <Icon className="h-6 w-6 text-violet-600" />
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold">
                          Step {index + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-base">{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 pl-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{detail}</span>
                            </li>
                          ))}
                      </ul>

                      <Separator />

                      <Alert className="bg-blue-50 border-blue-200">
                        <Cpu className="h-4 w-4 text-blue-600 mt-1" />
                        <AlertDescription className="text-xs leading-relaxed text-blue-800">
                          <strong className="text-blue-900">Under the hood:</strong> {step.technical}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* Troubleshooting Guide */}
          <Card className="animate-slide-up border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Troubleshooting</CardTitle>
                  <CardDescription>Common issues and quick fixes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <div className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                  {troubleshooting.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveTab(`issue-${index}`)}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors border",
                            activeTab === `issue-${index}` ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{item.issue}</span>
                      </button>
                    )
                  })}
                </div>

                {troubleshooting.map((item, index) => {
                    if (activeTab !== `issue-${index}`) return null;
                  const Icon = item.icon
                  return (
                    <div key={index} className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className={`h-6 w-6 ${item.severity === "high" ? "text-red-500" : "text-yellow-500"}`} />
                        <div>
                          <h4 className="font-semibold text-lg text-slate-900">{item.issue}</h4>
                          <Badge
                            variant="outline"
                            className={
                              item.severity === "high"
                                ? "text-red-600 border-red-200 bg-red-50"
                                : "text-yellow-600 border-yellow-200 bg-yellow-50"
                            }
                          >
                            {item.severity === "high" ? "High Priority" : "Medium Priority"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700">
                            <Settings className="h-4 w-4 text-primary" />
                            Solutions:
                          </h5>
                          <ul className="space-y-2">
                            {item.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{solution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  )
}
