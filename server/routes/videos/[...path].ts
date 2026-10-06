// Sirve los videos PÚBLICOS del bucket R2 `casa-videos` (carpeta `videos/`), p. ej. la bienvenida.
// Los videos de Contenidos van por /api/contenido/<slug>/video, que valida la suscripción
// (sus archivos viven en `contenidos/`, fuera del alcance de esta ruta).
// Caché de 1 año: al reemplazar un video hay que cambiar el `?v=` con que lo pide la página.
import { servirObjetoR2 } from '../../utils/r2'

interface CloudflareEnv {
  VIDEOS: R2Bucket
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.VIDEOS) throw createError({ statusCode: 503, statusMessage: 'Videos no disponibles' })

  const nombre = getRouterParam(event, 'path') ?? ''
  if (!/^[\w-]+\.mp4$/.test(nombre)) throw createError({ statusCode: 404 })

  return servirObjetoR2(event, env.VIDEOS, `videos/${nombre}`, {
    tipo: 'video/mp4',
    cache: 'public, max-age=31536000, immutable',
  })
})
