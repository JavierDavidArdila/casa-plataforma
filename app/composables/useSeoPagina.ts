// SEO por página: título y descripción únicos, canonical absoluta en la raíz del dominio,
// Open Graph y Twitter coherentes. Las páginas privadas (login, cuenta, pago, videos con sesión)
// llevan `noindex` y no declaran canonical (para no mandar señales contradictorias).
interface OpcionesSeo {
  title: string
  description: string
  /** Por defecto true. En false: robots noindex y sin canonical. */
  indexable?: boolean
  /** Ruta absoluta de la imagen social (por defecto el póster del video de bienvenida). */
  imagen?: string
}

const IMAGEN_SOCIAL = { ruta: '/images/bienvenida-poster.jpg', ancho: 1280, alto: 720 }

// Google corta las descripciones a ~160 caracteres: se recorta en el último espacio.
function recortar(texto: string, max = 160) {
  const limpio = texto.replace(/\s+/g, ' ').trim()
  if (limpio.length <= max) return limpio
  return limpio.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

export function useSeoPagina({ title, description: descripcionCompleta, indexable = true, imagen }: OpcionesSeo) {
  const description = recortar(descripcionCompleta)
  const route = useRoute()
  const sitio = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  // La canonical nunca lleva query (utm, etc.) ni barra final, salvo la raíz.
  const ruta = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
  const url = `${sitio}${ruta === '/' ? '/' : ruta}`
  const imagenUrl = `${sitio}${imagen ?? IMAGEN_SOCIAL.ruta}`

  useSeoMeta({
    title,
    description,
    robots: indexable ? 'index, follow' : 'noindex, nofollow',
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: 'C.A.S.A. — Del Cuidado a Distancia',
    ogLocale: 'es_CO',
    ogUrl: indexable ? url : undefined,
    ogImage: indexable ? imagenUrl : undefined,
    ogImageWidth: !imagen && indexable ? IMAGEN_SOCIAL.ancho : undefined,
    ogImageHeight: !imagen && indexable ? IMAGEN_SOCIAL.alto : undefined,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: indexable ? imagenUrl : undefined,
  })

  if (indexable) useHead({ link: [{ rel: 'canonical', href: url }] })
}
