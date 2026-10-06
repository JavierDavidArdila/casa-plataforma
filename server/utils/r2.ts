import type { H3Event } from 'h3'

// Sirve un objeto de R2 con soporte de `Range` (para adelantar el video sin descargarlo
// entero) y de `If-None-Match`. Lo usan la ruta pública /videos y las rutas protegidas
// de Contenidos (video y guía descargable).
export async function servirObjetoR2(
  event: H3Event,
  bucket: R2Bucket,
  clave: string,
  opciones: { tipo: string; cache: string; descarga?: string }
) {
  const cabeceras = new Headers(getRequestHeaders(event) as Record<string, string>)
  const objeto = await bucket.get(clave, { range: cabeceras, onlyIf: cabeceras })
  if (!objeto) throw createError({ statusCode: 404 })

  setResponseHeader(event, 'Accept-Ranges', 'bytes')
  setResponseHeader(event, 'Content-Type', opciones.tipo)
  setResponseHeader(event, 'Cache-Control', opciones.cache)
  setResponseHeader(event, 'ETag', objeto.httpEtag)
  if (opciones.descarga) setResponseHeader(event, 'Content-Disposition', `attachment; filename="${opciones.descarga}"`)

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
}
