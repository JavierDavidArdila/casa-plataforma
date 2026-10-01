// Sirve los videos del bucket R2 `casa-videos` (carpeta `videos/`) con soporte de
// `Range`, para que el navegador pueda adelantar y empezar a reproducir sin
// descargar el archivo completo. Los videos de bienvenida son públicos; los que
// requieren suscripción deben servirse por otra ruta que valide la sesión.
// Caché de 1 año: al reemplazar un video hay que cambiar el `?v=` con que lo pide la página.
interface CloudflareEnv {
  VIDEOS: R2Bucket
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.VIDEOS) throw createError({ statusCode: 503, statusMessage: 'Videos no disponibles' })

  const nombre = getRouterParam(event, 'path') ?? ''
  if (!/^[\w-]+\.mp4$/.test(nombre)) throw createError({ statusCode: 404 })
  const clave = `videos/${nombre}`

  const cabeceras = new Headers(getRequestHeaders(event) as Record<string, string>)
  const objeto = await env.VIDEOS.get(clave, { range: cabeceras, onlyIf: cabeceras })
  if (!objeto) throw createError({ statusCode: 404 })

  setResponseHeader(event, 'Accept-Ranges', 'bytes')
  setResponseHeader(event, 'Content-Type', 'video/mp4')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setResponseHeader(event, 'ETag', objeto.httpEtag)

  if (!('body' in objeto)) {
    setResponseStatus(event, 304)
    return null
  }

  const total = objeto.size
  const rango = objeto.range as { offset?: number; length?: number } | undefined
  if (cabeceras.has('range') && rango && (rango.offset !== undefined || rango.length !== undefined)) {
    const inicio = rango.offset ?? 0
    const largo = rango.length ?? total - inicio
    setResponseStatus(event, 206)
    setResponseHeader(event, 'Content-Range', `bytes ${inicio}-${inicio + largo - 1}/${total}`)
    setResponseHeader(event, 'Content-Length', largo)
  } else {
    setResponseHeader(event, 'Content-Length', total)
  }

  if (event.method === 'HEAD') return null
  return objeto.body
})
