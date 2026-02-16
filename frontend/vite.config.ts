import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cross-platform detection
const isWindows = process.platform === 'win32';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    base: '/',
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
      emptyOutDir: true,
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom'],
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      drop: isProduction ? ['console', 'debugger'] : []
    }
  };
});
