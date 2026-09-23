import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Clave gratuita de https://web3forms.com — usada por el formulario "Comuniquémonos".
      web3formsKey: '',
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    // Emula los bindings de Cloudflare (D1 incluido) en `nuxt dev`, contra una
    // base local en .wrangler/state — sin esto, /api/lead, /api/login, etc.
    // no tienen `event.context.cloudflare.env.DB` y fallan en desarrollo.
    modules: ['nitro-cloudflare-dev'],
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
