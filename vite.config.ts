import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'
import { faSubset } from './scripts/fa-subset.ts'

export default defineConfig({
  // faSubset: only the Font Awesome icons the app uses (see scripts/fa-subset.ts)
  plugins: [faSubset(), vue(), tailwindcss(), netlify()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
