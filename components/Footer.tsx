
import React, { useEffect, useState } from 'react';
import { Heart, Github, Twitter, Linkedin, Shield, Clock, Globe, Mail, BookOpen, Layers, CircleHelp, FileText } from './Icons';

export const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full mt-auto z-0 relative">
      <div className="bg-neutral-950 dark:bg-black text-neutral-300 py-16 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-6 col-span-1 md:col-span-2">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-white/10">
                  NW
                </div>
                <div>
                   <h3 className="text-xl font-black tracking-tight text-white leading-none">NOWHILE</h3>
                </div>
             </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Experience the future of file transfer. Direct peer-to-peer sharing directly in your browser without intermediaries.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 bg-neutral-900 rounded-xl hover:bg-white transition-colors hover:scale-110 duration-200 group border border-neutral-800 hover:border-white">
                <Github className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="p-3 bg-neutral-900 rounded-xl hover:bg-[#1DA1F2] transition-colors hover:scale-110 duration-200 group border border-neutral-800 hover:border-[#1DA1F2]">
                <Twitter className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="p-3 bg-neutral-900 rounded-xl hover:bg-[#0A66C2] transition-colors hover:scale-110 duration-200 group border border-neutral-800 hover:border-[#0A66C2]">
                <Linkedin className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
             <h4 className="font-bold text-white text-sm uppercase tracking-wider border-l-2 border-violet-500 pl-3">Resources</h4>
             <nav className="flex flex-col gap-3">
                <a href="#howto" className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <BookOpen className="w-4 h-4 text-neutral-600 group-hover:text-violet-400 transition-colors" />
                    How it Works
                </a>
                <a href="#tech" className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                     <Layers className="w-4 h-4 text-neutral-600 group-hover:text-violet-400 transition-colors" />
                     Architecture
                </a>
                <a href="#info" className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                     <FileText className="w-4 h-4 text-neutral-600 group-hover:text-violet-400 transition-colors" />
                     Components
                </a>
                <a href="#faq" className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                     <CircleHelp className="w-4 h-4 text-neutral-600 group-hover:text-violet-400 transition-colors" />
                     FAQ
                </a>
             </nav>
          </div>

          <div className="space-y-6">
             <h4 className="font-bold text-white text-sm uppercase tracking-wider border-l-2 border-emerald-500 pl-3">Status</h4>
             <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                   <Shield className="w-4 h-4" /> System Operational
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
                   <Clock className="w-3 h-3 text-amber-500" />
                   {time.toLocaleTimeString()}
                </div>
             </div>
             <div className="flex gap-4 text-xs text-neutral-500">
                <a href="#" className="hover:text-white flex items-center gap-1"><Globe className="w-3 h-3" /> EN</a>
                <a href="#" className="hover:text-white flex items-center gap-1"><Mail className="w-3 h-3" /> Support</a>
             </div>
          </div>

        </div>
      </div>

      <div className="bg-black py-8 border-b border-neutral-900">
         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-xs text-neutral-500 font-medium">
               © {time.getFullYear()} NOWHILE.
             </p>
             <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
                <span>by Nowhile</span>
             </div>
         </div>
      </div>

      <div className="bg-black py-8 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
              By accessing or using the NW peer-to-peer file sharing service, you acknowledge and agree that all transfers are direct. 
              NW does not store, view, or manage any user data transferred between peers. 
              Users retain full responsibility for the content they share. 
              Continued use of this platform constitutes acceptance of our usage policies and privacy guidelines.
           </p>
        </div>
      </div>
    </footer>
  );
};
