// Las 3 preguntas ("Comparte") al final del recorrido de un contenido: video → guía PDF → preguntas.
// Guarda las respuestas (tabla `comparte_respuestas`, migrations/0001_comparte.sql), marca el paso
// "preguntas" (migrations/0008_progreso_contenido.sql) y envía una sola vez el correo de felicitación.
// Si algo de la base falla no bloqueamos al usuario, solo lo registramos.

import { COOKIE_SESION, obtenerUsuarioDeSesion } from '../utils/auth'
import { marcarPaso } from '../utils/contenido'
import { enviarFelicitacionContenido } from '../utils/correo'

interface CloudflareEnv {
  DB: D1Database
  EMAIL?: SendEmail
}

interface CuerpoComparte {
  video?: string
  queSirvio?: string
  queProfundizar?: string
  otroTema?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CuerpoComparte>(event)
  const video = String(body?.video ?? '')

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) {
    console.warn('Binding DB no disponible: la opinión no se guardó.')
    return { ok: true, guardado: false, correoEnviado: false }
  }

  const usuario = await obtenerUsuarioDeSesion(env.DB, getCookie(event, COOKIE_SESION))

  let guardado = false
  try {
    await env.DB.prepare(
      `INSERT INTO comparte_respuestas (usuario_id, video, que_sirvio, que_profundizar, otro_tema)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(usuario?.id ?? null, video, body?.queSirvio ?? '', body?.queProfundizar ?? '', body?.otroTema ?? '')
      .run()
    guardado = true
  } catch (e) {
    console.error('Error guardando opinión de Comparte (¿falta correr migrations/0001_comparte.sql?):', e)
  }

  let correoEnviado = false
  if (usuario?.id && video) {
    try {
      await marcarPaso(env.DB, Number(usuario.id), video, 'preguntas')
      const progreso = await env.DB.prepare('SELECT correo_enviado_en FROM progreso_contenido WHERE usuario_id = ? AND video = ?')
        .bind(usuario.id, video)
        .first<{ correo_enviado_en: string | null }>()
      if (!progreso?.correo_enviado_en && usuario.email) {
        correoEnviado = await enviarFelicitacionContenido(env.EMAIL, {
          para: String(usuario.email),
          nombre: String(usuario.nombre ?? ''),
          slug: video,
          sitioUrl: String(useRuntimeConfig(event).public.siteUrl),
        })
        if (correoEnviado) {
          await env.DB.prepare("UPDATE progreso_contenido SET correo_enviado_en = datetime('now') WHERE usuario_id = ? AND video = ?")
            .bind(usuario.id, video)
            .run()
        }
      } else if (progreso?.correo_enviado_en) {
        correoEnviado = true
      }
    } catch (e) {
      console.error('Error en el progreso o el correo de felicitación (¿falta migrations/0008?):', e)
    }
  }

  return { ok: true, guardado, correoEnviado }
})
