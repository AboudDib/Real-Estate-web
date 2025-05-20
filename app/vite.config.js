import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, // You can change this if needed
  },
  plugins: [react()],
 optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Provide a global process object for broader compatibility
    'process': {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }
  }
});