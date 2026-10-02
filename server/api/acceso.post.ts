// Canje de un código de acceso (invitado o prensa, tarjeta impresa). Crea (la primera vez)
// un usuario suscrito con el nombre del medio/invitado y una sesión que vence en `vence_en`,
// que se fija en el primer canje (ahí empieza a correr `dias_acceso`). El mismo código sirve
// desde varios dispositivos hasta que venza, se desactive o llegue a `max_usos` ingresos.
// Cada canje queda en `accesos_log` (IP, ubicación, dispositivo, de dónde llegó) para estadísticas.

import { normalizarCodigoAcceso, pareceCodigoAcceso, formatearCodigoAcceso } from '../../shared/utils/codigo-acceso'
import { COOKIE_SESION, generarToken } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface FilaCodigo {
  id: number
  medio: string | null
  tipo: string
  dias_acceso: number
  max_usos: number
  usos: number
  activo: number
  usuario_id: number | null
  vence_en: string | null
}

interface CuerpoAcceso {
  codigo?: string
  origen?: { referrer?: string; ruta?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }
}

const DIA_MS = 24 * 60 * 60 * 1000
const MSG_INVALIDO = 'El código no es válido. Revisa que lo hayas escrito igual que en la tarjeta.'

const recortar = (v: unknown, max = 300) => (typeof v === 'string' && v ? v.slice(0, max) : null)

export default defineEventHandler(async (event) => {
  const body = await readBody<CuerpoAcceso>(event)
  if (!body?.codigo || !pareceCodigoAcceso(body.codigo)) {
    throw createError({ statusCode: 400, statusMessage: MSG_INVALIDO })
  }
  const codigo = formatearCodigoAcceso(normalizarCodigoAcceso(body.codigo))

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })
  const db = env.DB

  const fila = await db
    .prepare('SELECT id, medio, tipo, dias_acceso, max_usos, usos, activo, usuario_id, vence_en FROM codigos_acceso WHERE codigo = ?')
    .bind(codigo)
    .first<FilaCodigo>()
  if (!fila) throw createError({ statusCode: 400, statusMessage: MSG_INVALIDO })
  if (!fila.activo) throw createError({ statusCode: 403, statusMessage: 'Este código fue desactivado.' })
  if (fila.usos >= fila.max_usos) {
    throw createError({ statusCode: 403, statusMessage: 'Este código alcanzó su máximo de ingresos.' })
  }

  const ahora = Date.now()
  let venceEn = fila.vence_en
  if (venceEn && new Date(venceEn).getTime() <= ahora) {
    throw createError({ statusCode: 403, statusMessage: 'Este código ya venció.' })
  }

  // Primer canje: se fija el vencimiento y se crea el usuario (suscrito, sin contraseña).
  let usuarioId = fila.usuario_id
  if (!usuarioId) {
    venceEn = new Date(ahora + fila.dias_acceso * DIA_MS).toISOString()
    const nombre = fila.medio || (fila.tipo === 'invitado' ? 'Invitado' : 'Prensa')
    const creado = await db.prepare('INSERT INTO usuarios (nombre, suscrito) VALUES (?, 1)').bind(nombre).run()
    usuarioId = Number(creado.meta.last_row_id)
    await db
      .prepare("UPDATE codigos_acceso SET usuario_id = ?, vence_en = ?, canjeado_en = datetime('now') WHERE id = ?")
      .bind(usuarioId, venceEn, fila.id)
      .run()
  }
  await db.prepare('UPDATE codigos_acceso SET usos = usos + 1 WHERE id = ?').bind(fila.id).run()

  // Registro del ingreso: IP, ubicación (la entrega Cloudflare), dispositivo y de dónde llegó.
  const cf = (event.context.cloudflare as { request?: { cf?: Record<string, unknown> } } | undefined)?.request?.cf ?? {}
  const origen = body.origen ?? {}
  const ip = getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true }) ?? null
  const acceso = await db
    .prepare(
      `INSERT INTO accesos_log (codigo_id, usuario_id, tipo, ip, pais, region, ciudad, asn, zona_horaria,
         user_agent, idioma, referer, utm_source, utm_medium, utm_campaign, origen_ruta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      fila.id,
      usuarioId,
      fila.tipo,
      ip,
      recortar(cf.country, 8),
      recortar(cf.region, 80),
      recortar(cf.city, 80),
      typeof cf.asn === 'number' ? cf.asn : null,
      recortar(cf.timezone, 60),
      recortar(getRequestHeader(event, 'user-agent'), 400),
      recortar(getRequestHeader(event, 'accept-language'), 100),
      recortar(origen.referrer),
      recortar(origen.utm_source, 100),
      recortar(origen.utm_medium, 100),
      recortar(origen.utm_campaign, 100),
      recortar(origen.ruta, 200)
    )
    .run()
  const accesoId = Number(acceso.meta.last_row_id)

  const token = generarToken()
  await db
    .prepare('INSERT INTO sesiones (token, usuario_id, expira_en, acceso_id) VALUES (?, ?, ?, ?)')
    .bind(token, usuarioId, venceEn, accesoId)
    .run()
  setCookie(event, COOKIE_SESION, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(venceEn!),
  })

  return { ok: true, tipo: fila.tipo, venceEn }
})
