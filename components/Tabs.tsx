
import React from 'react';
import { cn } from '../utils';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeVariant?: 'notification' | 'count' | 'success' | 'warning';
  timestamp?: number;
  iconColor?: string;
  bgColor?: string;
}

interface TabsProps {
  activeTab: string;
  onChange: (id: string) => void;
  tabs: TabItem[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, tabs, className }) => {
  return (
    <div className={cn("flex space-x-1 bg-slate-100/80 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 dark:border-neutral-800 overflow-x-auto no-scrollbar shadow-inner dark:shadow-none", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const badgeCount = Number(tab.badge);
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap group outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              isActive 
                ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
                : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-white/60 dark:hover:bg-white/5"
            )}
          >
            <div className={cn(
              "p-1 rounded-md transition-colors",
              isActive ? (tab.bgColor || "bg-slate-100 dark:bg-neutral-700") : "bg-transparent"
            )}>
               <Icon className={cn(
                 "w-4 h-4 transition-colors", 
                 tab.iconColor ? tab.iconColor : (isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-neutral-500 group-hover:text-slate-600 dark:group-hover:text-neutral-300")
               )} />
            </div>
            
            <span>{tab.label}</span>

            {/* Badge System - Inline */}
            {badgeCount > 0 && (
              <span className={cn(
                "ml-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-extrabold rounded-full px-1.5 shadow-sm transition-transform duration-300 animate-fade-in",
                tab.badgeVariant === 'notification' && "bg-red-500 text-white",
                tab.badgeVariant === 'count' && "bg-slate-200 dark:bg-neutral-700 text-slate-600 dark:text-slate-200",
                tab.badgeVariant === 'success' && "bg-emerald-500 text-white",
                tab.badgeVariant === 'warning' && "bg-amber-500 text-white",
              )}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
