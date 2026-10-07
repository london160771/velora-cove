import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { output: { manualChunks(id) { if (/node_modules\/(gsap|lenis)\//.test(id.replaceAll('\\', '/'))) return 'motion' } } } },
})
