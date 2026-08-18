import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed at domain root (public_html).
// If hosted in a subfolder e.g. company.com/astegni/, change to: base: '/astegni/'
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
