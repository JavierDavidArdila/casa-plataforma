// Seguimiento de uso de las sesiones de invitado/prensa: páginas vistas y progreso de video.
// Para cualquier otra sesión (o sin sesión) responde 204 sin guardar nada.

import { COOKIE_SESION, obtenerContextoAcceso } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface CuerpoEvento {
  evento?: string
  ruta?: string
  video?: string
  posicion?: number
  duracion?: number
}

const EVENTOS = new Set(['pagina', 'video_inicio', 'video_progreso', 'video_fin'])
const numero = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null)

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  const body = await readBody<CuerpoEvento>(event).catch(() => null)
  if (!env?.DB || !body?.evento || !EVENTOS.has(body.evento)) {
    setResponseStatus(event, 204)
    return null
  }

  const contexto = await obtenerContextoAcceso(env.DB, getCookie(event, COOKIE_SESION))
  if (!contexto) {
    setResponseStatus(event, 204)
    return null
  }

  const posicion = numero(body.posicion)
  const duracion = numero(body.duracion)
  const porcentaje = posicion !== null && duracion ? Math.min(100, Math.round((posicion / duracion) * 1000) / 10) : null
  try {
    await env.DB.prepare(
      `INSERT INTO eventos_uso (acceso_id, codigo_id, usuario_id, evento, ruta, video, posicion_seg, duracion_seg, porcentaje)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        contexto.accesoId,
        contexto.codigoId,
        contexto.usuarioId,
        body.evento,
        typeof body.ruta === 'string' ? body.ruta.slice(0, 200) : null,
        typeof body.video === 'string' ? body.video.slice(0, 60) : null,
        posicion,
        duracion,
        porcentaje
      )
      .run()
  } catch (e) {
    console.error('No se pudo guardar el evento de uso:', e)
  }
  setResponseStatus(event, 204)
  return null
})
