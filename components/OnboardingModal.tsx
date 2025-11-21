
import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from './Button';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-slide-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-violet-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl transform rotate-3">
            <span className="font-black text-2xl">NW</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to NW Share</h2>
          <p className="text-slate-500 mt-2">Enter your display name to start sharing files securely with peers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg text-slate-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              maxLength={20}
              autoFocus
            />
          </div>

          <Button 
            className="w-full py-3 text-lg" 
            disabled={!name.trim()}
            type="submit"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          Your identity is saved locally and used for this session.
        </p>
      </div>
    </div>
  );
};
