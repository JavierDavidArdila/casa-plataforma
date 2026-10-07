// "Recuperar contraseña": recibe el correo o el código de usuario y, si hay una cuenta con contraseña
// y correo, envía un enlace de un solo uso a /restablecer-clave (migrations/0010_recuperar_clave.sql).
// Siempre responde lo mismo para no revelar qué correos están registrados.

import { generarToken, hashToken } from '../utils/auth'
import { enviarRecuperacionClave } from '../utils/correo'

interface CloudflareEnv {
  DB: D1Database
  EMAIL?: SendEmail
}

const VIGENCIA_MINUTOS = 60
const MAXIMO_POR_HORA = 3

export default defineEventHandler(async (event) => {
  const body = await readBody<{ usuario?: string }>(event)
  const dato = String(body?.usuario ?? '').trim()
  if (!dato) throw createError({ statusCode: 400, statusMessage: 'Escribe tu correo o tu usuario' })

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const usuario = await env.DB.prepare(
    'SELECT id, nombre, email, codigo_usuario FROM usuarios WHERE (codigo_usuario = ? OR lower(email) = lower(?)) AND password_hash IS NOT NULL'
  )
    .bind(dato, dato)
    .first<{ id: number; nombre: string | null; email: string | null; codigo_usuario: string | null }>()

  if (usuario?.email) {
    const recientes = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM recuperaciones_clave WHERE usuario_id = ? AND creado_en > datetime('now', '-1 hour')"
    )
      .bind(usuario.id)
      .first<{ n: number }>()

    if ((recientes?.n ?? 0) < MAXIMO_POR_HORA) {
      const token = generarToken()
      const expiraEn = new Date(Date.now() + VIGENCIA_MINUTOS * 60 * 1000).toISOString()
      await env.DB.prepare('INSERT INTO recuperaciones_clave (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)')
        .bind(usuario.id, await hashToken(token), expiraEn)
        .run()

      const sitioUrl = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
      await enviarRecuperacionClave(env.EMAIL, {
        para: usuario.email,
        nombre: usuario.nombre ?? '',
        enlace: `${sitioUrl}/restablecer-clave?token=${token}`,
        sitioUrl,
        // Se puede entrar con el correo o con el código de usuario; mostramos el código si ya lo tiene.
        usuario: usuario.codigo_usuario ?? usuario.email,
      })
    }
  }

  return { ok: true }
})
