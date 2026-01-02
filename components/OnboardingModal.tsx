
import React, { useState } from 'react';
import { ArrowRight, Sparkles, User, AlertCircle, Zap, Shield, Globe } from 'lucide-react';
import { cn } from '../utils';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);

  const validate = (value: string) => {
    if (value.length < 3) return "Min 3 characters required";
    if (!/^[a-zA-Z]/.test(value)) return "Must start with a letter";
    if (!/^[a-zA-Z0-9]+$/.test(value)) return "Only letters & numbers allowed";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(name);
    if (validationError) {
      setError(validationError);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500); // Reset shake animation
      return;
    }
    onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans animate-fade-in">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
      <div 
        className={cn(
            "relative w-full max-w-[360px] bg-white dark:bg-dusk-950 rounded-3xl p-6 shadow-2xl shadow-dusk-950/50 border border-white/20 overflow-hidden transition-all duration-300",
            isShake ? "animate-[shake_0.4s_ease-in-out]" : "animate-slide-up"
        )}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dusk-500 via-lavender-500 to-lcoral-500" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-lavender-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-dusk-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10 pt-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-dusk-50 to-lavender-50 dark:from-dusk-900/20 dark:to-lavender-900/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner transform -rotate-3 hover:rotate-0 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/10">
             <span className="text-3xl filter drop-shadow-sm">👋</span>
          </div>
          <h2 className="text-2xl font-black text-dusk-900 dark:text-white tracking-tight mb-1">Welcome</h2>
          <p className="text-xs font-bold text-dusk-400 uppercase tracking-wider">Choose your identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-2">
             <div className="relative group/input">
                <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", error ? "text-lcoral-400" : "text-dusk-400 group-focus-within/input:text-lcoral-500")}>
                   <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={handleChange}
                  placeholder="Display Name"
                  className={cn(
                    "w-full bg-dusk-50 dark:bg-dusk-900 border-2 rounded-xl pl-11 pr-10 py-3.5 text-base font-bold text-dusk-900 dark:text-white placeholder:text-dusk-400 focus:outline-none transition-all shadow-inner",
                    error 
                      ? "border-lcoral-500/50 focus:border-lcoral-500 bg-lcoral-50/10" 
                      : "border-dusk-100 dark:border-white/5 focus:border-lcoral-500/50 focus:bg-white dark:focus:bg-dusk-950"
                  )}
                  maxLength={15}
                  autoFocus
                />
                {name.length >= 3 && !error && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rosewood-500 animate-scale-in">
                      <Sparkles className="w-4 h-4" />
                   </div>
                )}
                {error && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lcoral-500 animate-scale-in">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                )}
             </div>
             
             <div className={cn("flex items-center gap-1.5 text-xs font-bold transition-all duration-300 overflow-hidden", error ? "text-lcoral-500 h-5 opacity-100" : "text-dusk-400 h-0 opacity-0")}>
                 <span className="pl-1">{error}</span>
             </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-dusk-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-dusk-900/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex justify-center gap-6 relative z-10 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-dusk-400">
               <div className="p-1.5 bg-dusk-100 dark:bg-white/5 rounded-lg mb-1"><Zap className="w-3 h-3" /></div>
               <span>FAST</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-dusk-400">
               <div className="p-1.5 bg-dusk-100 dark:bg-white/5 rounded-lg mb-1"><Shield className="w-3 h-3" /></div>
               <span>SECURE</span>
            </div>
             <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-dusk-400">
               <div className="p-1.5 bg-dusk-100 dark:bg-white/5 rounded-lg mb-1"><Globe className="w-3 h-3" /></div>
               <span>P2P</span>
            </div>
        </div>
      </div>
    </div>
  );
};
