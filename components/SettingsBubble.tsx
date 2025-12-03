
import React, { useState } from 'react';
import { Settings, X, Check, Moon, Sun } from 'lucide-react';
import { AppSettings } from '../types';
import { cn } from '../utils';

interface SettingsBubbleProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsBubble: React.FC<SettingsBubbleProps> = ({ settings, onUpdate, darkMode, onToggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-700 rounded-2xl shadow-2xl p-4 w-72 mb-2 animate-slide-up">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-neutral-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Settings</h3>
            <button onClick={toggleOpen} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Dark Mode
              </label>
              <button 
                onClick={onToggleDarkMode}
                className={cn(
                  "w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                  darkMode ? "bg-violet-600" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                  darkMode ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Auto Download */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">Auto Download</label>
              <button 
                onClick={() => onUpdate({ ...settings, autoDownload: !settings.autoDownload })}
                className={cn(
                  "w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                  settings.autoDownload ? "bg-emerald-500" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                  settings.autoDownload ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Chunk Size */}
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block">Chunk Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[16384, 65536, 262144].map(size => (
                  <button
                    key={size}
                    onClick={() => onUpdate({ ...settings, chunkSize: size })}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      settings.chunkSize === size 
                        ? "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300" 
                        : "bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-700"
                    )}
                  >
                    {size / 1024}KB
                  </button>
                ))}
              </div>
            </div>

            {/* Max Peers Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                 <label className="text-xs text-slate-400 uppercase font-bold">Max Peers</label>
                 <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-neutral-800 px-1.5 rounded">{settings.maxPeers}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={settings.maxPeers}
                onChange={(e) => onUpdate({ ...settings, maxPeers: parseInt(e.target.value) || 1 })}
                className="w-full h-2 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                 <span>1</span>
                 <span>10</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={toggleOpen}
        className="w-12 h-12 bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-700 text-white rounded-full shadow-lg shadow-slate-900/20 dark:shadow-violet-900/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};
