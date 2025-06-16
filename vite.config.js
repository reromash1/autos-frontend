import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7299/', // URL de tu backend
        changeOrigin: true,
        secure: false, // IMPORTANTE para certificados autofirmados
        ws: true
      }
    }
  }
});