
import React, { useState, useRef } from 'react';
import { Send, MessageSquare, Zap } from 'lucide-react';
import { ChatMessage } from '../types';
import { Button } from './Button';
import { cn } from '../utils';

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  myId: string;
  isConnected: boolean;
}

export const ChatTab: React.FC<ChatTabProps> = ({ messages, onSendMessage, myId, isConnected }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isConnected) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[60vh] md:h-[500px] min-h-[400px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm animate-fade-in relative">
       {/* Chat Header/Background Decoration */}
       <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/50 pointer-events-none" />

       {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 z-10">
             <div className="w-20 h-20 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <MessageSquare className="w-10 h-10 text-violet-300 dark:text-violet-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">No messages yet</h3>
             <p className="text-sm text-slate-400 mt-2 text-center max-w-xs">
               Start a conversation with your connected peers. Messages are encrypted and P2P.
             </p>
          </div>
       ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-4">
                    <div className="text-slate-400 text-[10px] font-bold tracking-wider flex items-center gap-2 opacity-70">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] md:max-w-[70%] flex flex-col", isMe ? "items-end" : "items-start")}>
                     <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-400">{isMe ? 'You' : msg.senderName || 'Peer'}</span>
                        <span className="text-[10px] text-slate-300">{formatTime(msg.timestamp)}</span>
                     </div>
                     <div className={cn(
                       "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed relative break-words",
                       isMe 
                         ? "bg-violet-600 text-white rounded-tr-none" 
                         : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-none"
                     )}>
                        {msg.text}
                     </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
       )}

       {/* Input Area */}
       <div className="p-3 md:p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 z-20">
         <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connect to a peer to chat"}
              disabled={!isConnected}
              className={cn(
                "flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500",
                !isConnected && "bg-slate-100 dark:bg-slate-800 cursor-not-allowed text-slate-400"
              )}
            />
            <Button type="submit" disabled={!inputText.trim() || !isConnected} className="rounded-xl px-4">
              <Send className="w-5 h-5" />
            </Button>
         </form>
       </div>
    </div>
  );
};