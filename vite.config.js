import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/efay_folio',
  resolve: {
    alias: {
      // Root aliases - using resolve() which works from current directory
      '@': resolve('./src'),
      '@assets': resolve('./src/assets'),
      '@components': resolve('./src/components'),
      '@hooks': resolve('./src/hooks'),
      '@contexts': resolve('./src/contexts'),
      '@lib': resolve('./src/lib'),
      '@stores': resolve('./src/stores'),
      '@types': resolve('./src/types'),
      
      // Component category aliases
      '@ui': resolve('./src/components/ui'),
      '@admin': resolve('./src/components/admin'),
      '@layout': resolve('./src/components/layout'),
      '@sections': resolve('./src/components/sections'),
    }
  }
})