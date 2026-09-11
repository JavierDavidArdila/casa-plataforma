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
      title: 'C.A.S.A. — Del Cuidado a Distancia',
      meta: [
        {
          name: 'description',
          content:
            'Plataforma C.A.S.A.: test de bienestar, contenidos y acompañamiento para quienes cuidan a distancia.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap',
        },
      ],
    },
  },
})
