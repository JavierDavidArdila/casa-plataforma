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
      // URL canónica del sitio (raíz, sin www ni workers.dev). Se puede sobreescribir con NUXT_PUBLIC_SITE_URL.
      siteUrl: 'https://casacuidadoadistancia.com',
    },
  },

  // Deshabilitadas por ahora (pedido del cliente, 5 oct 2026): el listado de Contenidos y Quiénes Somos.
  // Solo queda abierto el contenido COMPRENDER (/contenidos/comprender).
  routeRules: {
    '/contenidos': { redirect: { to: '/', statusCode: 302 } },
    '/quienes-somos': { redirect: { to: '/', statusCode: 302 } },
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
            'Plataforma C.A.S.A.: Cuestionario de Bienestar, contenidos y acompañamiento para quienes cuidan a distancia.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
