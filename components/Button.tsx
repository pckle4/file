import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ember' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  disabled,
  ...props 
}) => {
  const variants = {
    primary: cn(
      'bg-gradient-to-r from-dusk-500 to-dusk-600',
      'text-white font-semibold',
      'shadow-lg shadow-dusk-500/20',
      'hover:shadow-xl hover:shadow-dusk-500/30',
      'dark:from-dusk-600 dark:to-dusk-700'
    ),
    secondary: cn(
      'bg-white dark:bg-dusk-800',
      'text-dusk-700 dark:text-dusk-200',
      'border border-dusk-200 dark:border-dusk-700',
      'shadow-sm',
      'hover:bg-dusk-50 dark:hover:bg-dusk-700',
      'hover:border-dusk-300 dark:hover:border-dusk-600'
    ),
    ghost: cn(
      'bg-transparent',
      'text-lavender-500 dark:text-lavender-400',
      'hover:bg-lavender-100 dark:hover:bg-lavender-800',
      'hover:text-lavender-700 dark:hover:text-lavender-200'
    ),
    ember: cn(
      'bg-gradient-to-r from-lcoral-500 to-lcoral-600',
      'text-white font-semibold',
      'shadow-lg shadow-lcoral-500/20',
      'hover:shadow-xl hover:shadow-lcoral-500/30'
    ),
    danger: cn(
      'bg-rosewood-50 dark:bg-rosewood-900/20',
      'text-rosewood-600 dark:text-rosewood-400',
      'border border-rosewood-200 dark:border-rosewood-800',
      'hover:bg-rosewood-100 dark:hover:bg-rosewood-900/30'
    ),
    accent: cn(
      'bg-gradient-to-r from-bronze-400 to-bronze-500',
      'text-dusk-900 font-semibold',
      'shadow-lg shadow-bronze-500/20',
      'hover:shadow-xl hover:shadow-bronze-500/30'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
    icon: 'p-2 rounded-xl',
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden',
        'inline-flex items-center justify-center',
        'font-medium',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        'outline-none focus-visible:ring-2 focus-visible:ring-dusk-500 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <motion.svg 
          className="w-4 h-4 mr-2" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
