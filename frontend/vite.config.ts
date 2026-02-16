import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cross-platform detection
const isWindows = process.platform === 'win32';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      overlay: false,
      port: 5173,
      // Windows-specific HMR configuration
      ...(isWindows && {
        clientPort: 5173,
      })
    },
    cors: true,
    open: false,
    // Windows-specific watch options
    watch: {
      usePolling: isWindows,
      interval: isWindows ? 1000 : undefined,
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // CRITICAL: Disable chunk splitting to prevent loading errors
        manualChunks: undefined,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 2000,
    // Prevent chunk loading errors
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
    force: true
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: ['console', 'debugger']
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
