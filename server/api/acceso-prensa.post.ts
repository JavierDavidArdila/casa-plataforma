// Canje de un código de prensa (tarjeta impresa). Crea (la primera vez) un usuario
// suscrito con el nombre del medio y una sesión que vence en `vence_en`, que se fija
// en el primer canje (ahí empieza a correr `dias_acceso`). El mismo código sirve desde
// varios dispositivos hasta que venza, se desactive o llegue a `max_usos` ingresos.

import { normalizarCodigoPrensa, pareceCodigoPrensa, formatearCodigoPrensa } from '../../shared/utils/codigo-prensa'
import { COOKIE_SESION, generarToken } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface FilaCodigo {
  id: number
  medio: string | null
  dias_acceso: number
  max_usos: number
  usos: number
  activo: number
  usuario_id: number | null
  vence_en: string | null
}

const DIA_MS = 24 * 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  const body = await readBody<{ codigo?: string }>(event)
  if (!body?.codigo || !pareceCodigoPrensa(body.codigo)) {
    throw createError({ statusCode: 400, statusMessage: 'El código no es válido. Revisa que lo hayas escrito igual que en la tarjeta.' })
  }
  const codigo = formatearCodigoPrensa(normalizarCodigoPrensa(body.codigo))

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })
  const db = env.DB

  const fila = await db
    .prepare('SELECT id, medio, dias_acceso, max_usos, usos, activo, usuario_id, vence_en FROM codigos_prensa WHERE codigo = ?')
    .bind(codigo)
    .first<FilaCodigo>()
  if (!fila) {
    throw createError({ statusCode: 400, statusMessage: 'El código no es válido. Revisa que lo hayas escrito igual que en la tarjeta.' })
  }
  if (!fila.activo) throw createError({ statusCode: 403, statusMessage: 'Este código fue desactivado.' })

  if (fila.usos >= fila.max_usos) {
    throw createError({ statusCode: 403, statusMessage: 'Este código alcanzó su máximo de ingresos.' })
  }

  const ahora = Date.now()
  let venceEn = fila.vence_en
  if (venceEn && new Date(venceEn).getTime() <= ahora) {
    throw createError({ statusCode: 403, statusMessage: 'Este código ya venció.' })
  }

  // Primer canje: se fija el vencimiento y se crea el usuario de prensa (suscrito, sin contraseña).
  let usuarioId = fila.usuario_id
  if (!usuarioId) {
    venceEn = new Date(ahora + fila.dias_acceso * DIA_MS).toISOString()
    const nombre = fila.medio || 'Prensa'
    const creado = await db
      .prepare('INSERT INTO usuarios (nombre, suscrito) VALUES (?, 1)')
      .bind(nombre)
      .run()
    usuarioId = Number(creado.meta.last_row_id)
    await db
      .prepare("UPDATE codigos_prensa SET usuario_id = ?, vence_en = ?, canjeado_en = datetime('now') WHERE id = ?")
      .bind(usuarioId, venceEn, fila.id)
      .run()
  }
  await db.prepare('UPDATE codigos_prensa SET usos = usos + 1 WHERE id = ?').bind(fila.id).run()

  const token = generarToken()
  await db
    .prepare('INSERT INTO sesiones (token, usuario_id, expira_en) VALUES (?, ?, ?)')
    .bind(token, usuarioId, venceEn)
    .run()
  setCookie(event, COOKIE_SESION, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(venceEn!),
  })

  return { ok: true, venceEn }
})
