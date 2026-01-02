import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div 
      className={cn(
        "flex gap-1 p-1.5",
        "bg-dusk-100/80 dark:bg-dusk-900/80",
        "backdrop-blur-md",
        "border border-dusk-200/60 dark:border-dusk-800",
        "rounded-2xl",
        "overflow-x-auto no-scrollbar",
        "shadow-inner dark:shadow-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const badgeCount = Number(tab.badge);
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2",
              "px-4 py-2.5 rounded-xl",
              "text-sm font-semibold",
              "whitespace-nowrap",
              "outline-none",
              "focus-visible:ring-2 focus-visible:ring-lcoral-500",
              "transition-colors duration-200",
              isActive 
                ? "text-dusk-900 dark:text-white" 
                : "text-lavender-500 dark:text-lavender-400 hover:text-dusk-700 dark:hover:text-dusk-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Active background pill with layout animation */}
            {isActive && (
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-white dark:bg-dusk-800",
                  "shadow-sm",
                  "ring-1 ring-black/5 dark:ring-white/5"
                )}
                layoutId="activeTab"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            
            {/* Icon container */}
            <motion.div 
              className={cn(
                "relative z-10 p-1 rounded-md transition-colors duration-200",
                isActive && tab.bgColor ? tab.bgColor : (isActive && "bg-lcoral-100 dark:bg-lcoral-900/30")
              )}
              animate={{ 
                rotate: isActive ? [0, -5, 5, 0] : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon className={cn(
                "w-4 h-4 transition-colors duration-200", 
                isActive && tab.iconColor ? tab.iconColor : (isActive 
                  ? "text-lcoral-600 dark:text-lcoral-400" 
                  : "text-lavender-400 dark:text-lavender-500")
              )} />
            </motion.div>
            
            <span className="relative z-10">{tab.label}</span>

            {/* Badge */}
            <AnimatePresence mode="popLayout">
              {badgeCount > 0 && (
                <motion.span 
                  className={cn(
                    "relative z-10 ml-1",
                    "min-w-[18px] h-[18px]",
                    "flex items-center justify-center",
                    "text-[10px] font-bold",
                    "rounded-full px-1.5",
                    "shadow-sm",
                    tab.badgeVariant === 'notification' && "bg-lcoral-500 text-white",
                    tab.badgeVariant === 'count' && "bg-dusk-200 dark:bg-dusk-700 text-dusk-600 dark:text-dusk-300",
                    tab.badgeVariant === 'success' && "bg-rosewood-500 text-white",
                    tab.badgeVariant === 'warning' && "bg-bronze-500 text-white",
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {badgeCount > 99 ? '99+' : badgeCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
};
