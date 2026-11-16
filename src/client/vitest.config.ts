import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Les composants testés évitent les imports automatiques de Nuxt : ils importent explicitement ce qu'ils utilisent.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
