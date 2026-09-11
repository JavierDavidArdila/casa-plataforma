import { COOKIE_SESION, crearSesion, verificarPassword } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ usuario?: string; password?: string }>(event)
  if (!body?.usuario || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Usuario y contraseña son obligatorios' })
  }

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const usuario = await env.DB.prepare(
    'SELECT id, password_hash, password_salt FROM usuarios WHERE codigo_usuario = ? OR email = ?'
  )
    .bind(body.usuario, body.usuario)
    .first<{ id: number; password_hash: string | null; password_salt: string | null }>()

  if (!usuario?.password_hash || !usuario.password_salt) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario o contraseña incorrectos' })
  }

  const valido = await verificarPassword(body.password, usuario.password_hash, usuario.password_salt)
  if (!valido) throw createError({ statusCode: 401, statusMessage: 'Usuario o contraseña incorrectos' })

  const token = await crearSesion(env.DB, usuario.id)
  setCookie(event, COOKIE_SESION, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  })

  return { ok: true }
})
