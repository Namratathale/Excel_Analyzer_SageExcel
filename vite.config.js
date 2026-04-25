import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: '/foo' -> 'http://localhost:4567/foo'
      // '/api': 'http://localhost:5001', // This is a valid shorthand
      
      // Using the object syntax for more options
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false, // This can help with some proxying issues
      }
    }
  }
})