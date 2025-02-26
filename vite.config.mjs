import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [
    react(),
    wasm()
  ],
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  optimizeDeps: {
    exclude: ['src/utils/constants.jsx'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    open: true,
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  }
});
