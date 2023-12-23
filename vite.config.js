import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:5175',
    port: 5175
  },
  plugins: [react()]
});
