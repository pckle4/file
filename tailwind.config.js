/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        // NANO BANANA PALETTE (From index.html)
        coral: {
          50: '#fef5f4', 100: '#fdeae8', 200: '#fbd4d0', 300: '#f8b3ad',
          400: '#f4857b', 500: '#ed6a5a', 600: '#d94a38', 700: '#b63626',
          800: '#962f23', 900: '#7d2b21', 950: '#43130d',
        },
        lemon: {
          50: '#fefef6', 100: '#fdfdeb', 200: '#fcfad4', 300: '#faf5ad',
          400: '#f4e976', 500: '#ebdb4d', 600: '#d1ba2a', 700: '#a78d22',
          800: '#896f22', 900: '#735b22', 950: '#423210',
        },
        teal: {
          50: '#f2f9f9', 100: '#def0f1', 200: '#c0e2e4', 300: '#96ccd0',
          400: '#69b0b6', 500: '#5ca4a9', 600: '#46868d', 700: '#3a6c72',
          800: '#35595e', 900: '#2f4a4f', 950: '#1b2d31',
        },
        ash: {
          50: '#f5f9f8', 100: '#e5f0ef', 200: '#cce0de', 300: '#9bc1bc',
          400: '#7ca8a4', 500: '#5e8b87', 600: '#49706d', 700: '#3d5a58',
          800: '#344948', 900: '#2d3d3c', 950: '#182424',
        },
        linen: {
          50: '#f7f9f6', 100: '#e6ebe0', 200: '#d4ded1', 300: '#b8c9b3',
          400: '#9aad95', 500: '#7d9278', 600: '#62765e', 700: '#4f5f4c',
          800: '#404c3e', 900: '#353f34', 950: '#1d231c',
        },
        // Restoring Missing Colors found in App.tsx
        french: { // Violet/Indigo-ish
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
        },
        tangerine: { // Orange
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12', 950: '#431407',
        },
        taupe: { // Warm Neutral
          50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
          400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c',
          800: '#292524', 900: '#1c1917', 950: '#0c0a09',
        },
        glaucous: { // Blue-grey
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
          400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
          800: '#075985', 900: '#0c4a6e', 950: '#082f49',
        },
        // DUSK-CORAL PALETTE (Primary Theme)
        dusk: { // Dusk Blue - Deep navy-blue primary
          50: '#f0f4f8', 100: '#d9e2ec', 200: '#b3c5d9', 300: '#8da8c5',
          400: '#6689b1', 500: '#355070', 600: '#2d4560', 700: '#243850',
          800: '#1c2b3f', 900: '#131d2e', 950: '#0a1018',
        },
        lavender: { // Dusty Lavender - Muted purple accent
          50: '#f8f6f9', 100: '#efe9f2', 200: '#ded3e4', 300: '#c5b4d0',
          400: '#a38fb5', 500: '#6d597a', 600: '#5c4a68', 700: '#4a3c55',
          800: '#392e43', 900: '#272030', 950: '#16121b',
        },
        rosewood: { // Rosewood - Warm dusty rose
          50: '#fdf5f6', 100: '#fbe8eb', 200: '#f6d0d6', 300: '#eeb0ba',
          400: '#d8899a', 500: '#b56576', 600: '#9a5264', 700: '#7d4251',
          800: '#60333f', 900: '#43242d', 950: '#27151a',
        },
        lcoral: { // Light Coral - Vibrant coral accent
          50: '#fef5f5', 100: '#fee7e8', 200: '#fdd0d1', 300: '#fba8aa',
          400: '#f28385', 500: '#e56b6f', 600: '#cd4b50', 700: '#ac3a3f',
          800: '#8e3236', 900: '#7d2f32', 950: '#441517',
        },
        bronze: { // Light Bronze - Warm peachy tan
          50: '#fef9f5', 100: '#fdf0e7', 200: '#fbe0ce', 300: '#f8c9aa',
          400: '#f4b085', 500: '#eaac8b', 600: '#d88a60', 700: '#b66b47',
          800: '#94533a', 900: '#7a4532', 950: '#422218',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'magnetic': 'magnetic 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'text-glow': 'textGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(43, 69, 112, 0.3)' }, '50%': { boxShadow: '0 0 40px rgba(43, 69, 112, 0.6)' } },
        magnetic: { '0%': { transform: 'translate(0, 0) scale(1)' }, '25%': { transform: 'translate(10px, -15px) scale(1.02)' }, '50%': { transform: 'translate(-5px, 10px) scale(0.98)' }, '75%': { transform: 'translate(-15px, -5px) scale(1.01)' }, '100%': { transform: 'translate(0, 0) scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        textGlow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(237,106,90,0.5)' },
          '50%': { textShadow: '0 0 30px rgba(237,106,90,0.8),0 0 60px rgba(237,106,90,0.4)' }
        }
      },
      boxShadow: {
        'glow-dusk': '0 0 30px rgba(53, 80, 112, 0.3)',
        'glow-lavender': '0 0 30px rgba(109, 89, 122, 0.25)',
        'glow-rosewood': '0 0 30px rgba(181, 101, 118, 0.25)',
        'glow-lcoral': '0 0 30px rgba(229, 107, 111, 0.30)',
        'glow-bronze': '0 0 30px rgba(234, 172, 139, 0.25)',
        'glow-french': '0 0 30px rgba(139, 92, 246, 0.25)',
        'glow-tangerine': '0 0 30px rgba(249, 115, 22, 0.25)',
        'glow-sky': '0 0 30px rgba(14, 165, 233, 0.3)',
        'elevated': '0 20px 50px -12px rgba(53, 80, 112, 0.25)',
      },
      screens: {
        'xs': '375px',
      }
    }
  },
  plugins: [],
}
