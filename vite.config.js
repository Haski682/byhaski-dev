import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// Dos páginas: español en "/" e inglés en "/en/". Cada una tiene sus propios
// meta tags, así un link compartido muestra la vista previa en su idioma.
export default defineConfig({
  plugins: [vue()],
  build: {
    // three.js (~130 KB gzip) se carga aparte y solo cuando arranca el hero.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
      },
    },
  },
})
