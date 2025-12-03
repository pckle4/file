
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Zap, Globe, Command } from 'lucide-react';
import { cn } from '../utils';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#050505] overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-emerald-500/10 rounded-full blur-[100px] animate-float" />
      </div>
      
      <div className="relative w-full max-w-[480px] animate-slide-up">
        {/* Card Container */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl shadow-black/50 relative overflow-hidden group">
          
          {/* Subtle sheen effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10 relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-40 rounded-full animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-black rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 relative z-10 transform -rotate-3 transition-transform group-hover:rotate-0 duration-500">
                <span className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 to-blue-400 tracking-tighter">NW</span>
              </div>
              {/* Decorative Icons */}
              <div className="absolute -right-6 -top-2 p-2 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-lg animate-float-delayed">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="absolute -left-6 -bottom-2 p-2 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-lg animate-float">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">NOWHILE</h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              Secure, serverless peer-to-peer file sharing directly in your browser.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2.5">
               <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                 <Command className="w-3 h-3" /> Identity
               </label>
               <div className="relative group/input">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter display name..."
                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-2xl px-5 py-4 text-lg font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-[#0a0a0a] transition-all"
                    maxLength={20}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 transform">
                     <Sparkles className={cn("w-5 h-5", name.trim() ? "text-violet-400 scale-110" : "text-slate-700 scale-100")} />
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start Sharing 
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Features */}
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-3 relative z-10">
             <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Shield className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End-to-End Encrypted</span>
             </div>
             <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Zap className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">P2P Performance</span>
             </div>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-6 font-medium">
          No registration • No cloud storage • No limits
        </p>
      </div>
    </div>
  );
};
