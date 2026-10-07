// Paso final de "Recuperar contraseña": valida el token del correo (vigente y sin usar), guarda la
// contraseña nueva, cierra las demás sesiones del usuario y deja abierta una nueva.

import { claveValida } from '../../shared/utils/clave'
import { COOKIE_SESION, crearSesion, hashPassword, hashToken } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event)
  if (!body?.token) throw createError({ statusCode: 400, statusMessage: 'El enlace no es válido' })
  if (!body.password || !claveValida(body.password)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y un carácter especial',
    })
  }

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const recuperacion = await env.DB.prepare(
    'SELECT id, usuario_id, expira_en FROM recuperaciones_clave WHERE token_hash = ? AND usado_en IS NULL'
  )
    .bind(await hashToken(body.token))
    .first<{ id: number; usuario_id: number; expira_en: string }>()

  if (!recuperacion || new Date(recuperacion.expira_en).getTime() < Date.now()) {
    throw createError({ statusCode: 400, statusMessage: 'El enlace venció o ya se usó. Pide uno nuevo.' })
  }

  const { hash, salt } = await hashPassword(body.password)
  await env.DB.batch([
    env.DB.prepare("UPDATE recuperaciones_clave SET usado_en = datetime('now') WHERE id = ?").bind(recuperacion.id),
    env.DB.prepare('UPDATE usuarios SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, recuperacion.usuario_id),
    env.DB.prepare('DELETE FROM sesiones WHERE usuario_id = ?').bind(recuperacion.usuario_id),
  ])

  const token = await crearSesion(env.DB, recuperacion.usuario_id)
  setCookie(event, COOKIE_SESION, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  })

  return { ok: true }
})
