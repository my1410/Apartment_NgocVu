import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Apartment_NgocVu/' : '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/antd/') || id.includes('/@ant-design/')) return 'antd';
          if (id.includes('/@react-google-maps/')) return 'maps';
          if (id.includes('/framer-motion/') || id.includes('/styled-components/')) return 'motion';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) return 'react';
          return 'vendor';
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
