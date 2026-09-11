import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare_module',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es-CO' },
      title: 'Test de Bienestar C.A.S.A.',
      meta: [
        {
          name: 'description',
          content:
            'Un test breve, no clínico, para ubicar tu nivel de esfuerzo como cuidador a distancia y en qué área necesitas más apoyo.',
        },
      ],
    },
  },
})
