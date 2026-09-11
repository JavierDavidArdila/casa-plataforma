// Paso "Crear cuenta": el usuario ya hizo el test y decidió entrar a la
// plataforma. Requiere sesión activa (viene de /api/lead). Le pone
// contraseña a su registro; el código de usuario se asigna después, al
// confirmar el pago (ver /api/pago).

import { COOKIE_SESION, hashPassword, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  if (!body?.password || body.password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'La contraseña debe tener al menos 8 caracteres' })
  }

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)
  if (!usuario) throw createError({ statusCode: 401, statusMessage: 'Sesión no encontrada, vuelve a empezar el test' })

  const { hash, salt } = await hashPassword(body.password)
  await env.DB.prepare('UPDATE usuarios SET password_hash = ?, password_salt = ? WHERE id = ?')
    .bind(hash, salt, usuario.id)
    .run()

  return { ok: true }
})
