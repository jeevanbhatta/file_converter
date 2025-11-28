import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/file_converter/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'converters': ['mammoth', 'turndown', 'marked', 'docx', 'browser-image-compression', 'heic2any']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['mammoth', 'turndown', 'marked', 'docx', 'browser-image-compression', 'heic2any']
  }
})

