// Feedback del panel "Comparte" en el detalle de cada video de Contenidos.
// Requiere la tabla `comparte_respuestas` — ver migrations/0001_comparte.sql.
// Igual que en /api/test-bienestar: si la tabla no existe todavía o el
// binding DB no está disponible, no bloqueamos al usuario, solo lo registramos.

import { COOKIE_SESION, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface CuerpoComparte {
  video?: string
  queSirvio?: string
  queProfundizar?: string
  otroTema?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CuerpoComparte>(event)

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) {
    console.warn('Binding DB no disponible: la opinión no se guardó.')
    return { ok: true, guardado: false }
  }

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)

  try {
    await env.DB.prepare(
      `INSERT INTO comparte_respuestas (usuario_id, video, que_sirvio, que_profundizar, otro_tema)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(usuario?.id ?? null, body?.video ?? '', body?.queSirvio ?? '', body?.queProfundizar ?? '', body?.otroTema ?? '')
      .run()
    return { ok: true, guardado: true }
  } catch (e) {
    console.error('Error guardando opinión de Comparte (¿falta correr migrations/0001_comparte.sql?):', e)
    return { ok: true, guardado: false }
  }
})
