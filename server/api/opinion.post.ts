// Opinión por video de las sesiones de invitado/prensa: ¿te gustó? + mensaje.
// Una por usuario y video: si la reenvían, se reemplaza. `respuestas` queda para campos extra
// (JSON) cuando el cliente confirme el formulario definitivo.

import { VIDEOS } from '../../app/data/videos'
import { COOKIE_SESION, obtenerContextoAcceso } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface CuerpoOpinion {
  video?: string
  meGusto?: boolean
  mensaje?: string
  respuestas?: Record<string, unknown>
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const contexto = await obtenerContextoAcceso(env.DB, getCookie(event, COOKIE_SESION))
  if (!contexto) throw createError({ statusCode: 401, statusMessage: 'Tu acceso no está activo o ya venció.' })

  const body = await readBody<CuerpoOpinion>(event)
  if (!body?.video || !VIDEOS.some((v) => v.slug === body.video) || typeof body.meGusto !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'Cuéntanos si te gustó o no.' })
  }
  const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim().slice(0, 2000) : ''
  const respuestas = body.respuestas && typeof body.respuestas === 'object' ? JSON.stringify(body.respuestas).slice(0, 4000) : null

  await env.DB.prepare(
    `INSERT INTO opiniones_acceso (codigo_id, usuario_id, tipo, video, me_gusto, mensaje, respuestas)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (usuario_id, video) DO UPDATE SET me_gusto = excluded.me_gusto, mensaje = excluded.mensaje,
       respuestas = excluded.respuestas, creado_en = datetime('now')`
  )
    .bind(contexto.codigoId, contexto.usuarioId, contexto.tipo, body.video, body.meGusto ? 1 : 0, mensaje, respuestas)
    .run()

  await env.DB.prepare(
    "INSERT INTO eventos_uso (acceso_id, codigo_id, usuario_id, evento, video) VALUES (?, ?, ?, 'opinion', ?)"
  )
    .bind(contexto.accesoId, contexto.codigoId, contexto.usuarioId, body.video)
    .run()

  return { ok: true }
})
