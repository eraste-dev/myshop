import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  ssr: true,
  // Port de développement : aligné sur infra/scripts/lib.sh (plage 510xx, hors des ports usuels).
  devServer: { port: 51001 },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Boutique de pagnes',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  build: {
    transpile: ['@shop-pagne/shared', '@shop-pagne/mocks'],
  },
  nitro: {
    // Les paquets du monorepo sont en TypeScript : on les intègre au serveur plutôt que de les charger depuis node_modules.
    externals: { inline: ['@shop-pagne/shared', '@shop-pagne/mocks'] },
  },
  typescript: {
    strict: true,
  },
})
