
import React, { useState } from 'react';
import { Settings, X, Check, Moon, Sun } from 'lucide-react';
import { AppSettings } from '../types';
import { cn } from '../utils';

interface SettingsBubbleProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  visible?: boolean;
}

export const SettingsBubble: React.FC<SettingsBubbleProps> = ({ 
  settings, 
  onUpdate, 
  darkMode, 
  onToggleDarkMode,
  visible = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={cn(
      "fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end gap-2 transition-all duration-300 ease-in-out",
      visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
    )}>
      {isOpen && (
        <div className="bg-white/90 dark:bg-dusk-900/90 backdrop-blur-xl border border-dusk-200 dark:border-dusk-700 rounded-2xl shadow-2xl p-4 w-72 mb-2 animate-slide-up origin-bottom-right">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-dusk-100 dark:border-dusk-800">
            <h3 className="font-semibold text-dusk-800 dark:text-dusk-100">Settings</h3>
            <button onClick={toggleOpen} className="text-lavender-400 hover:text-dusk-600 dark:hover:text-dusk-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-dusk-600 dark:text-dusk-300 font-medium flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Dark Mode
              </label>
              <button 
                onClick={onToggleDarkMode}
                className={cn(
                  "w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                  darkMode ? "bg-lavender-600" : "bg-dusk-200"
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
              <label className="text-sm text-dusk-600 dark:text-dusk-300 font-medium">Auto Download</label>
              <button 
                onClick={() => onUpdate({ ...settings, autoDownload: !settings.autoDownload })}
                className={cn(
                  "w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                  settings.autoDownload ? "bg-rosewood-500" : "bg-dusk-200"
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
              <label className="text-xs text-lavender-400 uppercase font-bold mb-1.5 block">Chunk Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[16384, 65536, 262144].map(size => (
                  <button
                    key={size}
                    onClick={() => onUpdate({ ...settings, chunkSize: size })}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      settings.chunkSize === size 
                        ? "bg-dusk-50 dark:bg-dusk-900/50 border-dusk-200 dark:border-dusk-700 text-dusk-600 dark:text-dusk-300" 
                        : "bg-dusk-50/50 dark:bg-dusk-950/50 border-transparent text-lavender-500 dark:text-lavender-400 hover:bg-dusk-100 dark:hover:bg-dusk-800"
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
                 <label className="text-xs text-lavender-400 uppercase font-bold">Max Peers</label>
                 <span className="text-xs font-mono font-bold text-dusk-700 dark:text-dusk-300 bg-dusk-100 dark:bg-dusk-800 px-1.5 rounded">{settings.maxPeers}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={settings.maxPeers}
                onChange={(e) => onUpdate({ ...settings, maxPeers: parseInt(e.target.value) || 1 })}
                className="w-full h-2 bg-dusk-200 dark:bg-dusk-700 rounded-lg appearance-none cursor-pointer accent-lcoral-600"
              />
              <div className="flex justify-between text-[10px] text-lavender-400 mt-1">
                 <span>1</span>
                 <span>10</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={toggleOpen}
        className="w-12 h-12 bg-dusk-900 dark:bg-lavender-600 hover:bg-dusk-800 dark:hover:bg-lavender-700 text-white rounded-full shadow-lg shadow-dusk-900/20 dark:shadow-black/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};
