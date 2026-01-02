import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      // Enable tree-shaking
      treeshake: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-peer': ['peerjs'],
            'vendor-icons': ['lucide-react'],
          },
          // Compact output
          compact: true,
        },
        // Tree-shake unused exports
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
        }
      },
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 500,
      // Source maps off for smaller build
      sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'peerjs', 'lucide-react'],
    }
  };
});
