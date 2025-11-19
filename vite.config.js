import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to network
    port: 3000,
    allowedHosts: [
      '.watercreststudio.com', // Allow all subdomains
      'localhost',
      '.local' // Allow .local domains
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
