// Paso "Crear cuenta": el usuario ya hizo el test y decidió entrar a la
// plataforma. Requiere sesión activa (viene de /api/lead). Le pone
// contraseña a su registro; el código de usuario se asigna después, al
// confirmar el pago (ver /api/pago), salvo para los primeros CUPO_GRATIS inscritos:
// ellos quedan activos al crear la cuenta, sin pago.

import { claveValida } from '../../shared/utils/clave'
import { CUPO_GRATIS } from '../../shared/utils/cupo'
import { COOKIE_SESION, generarCodigoUsuario, hashPassword, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  if (!body?.password || !claveValida(body.password)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y un carácter especial',
    })
  }

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)
  if (!usuario) throw createError({ statusCode: 401, statusMessage: 'Sesión no encontrada, vuelve a empezar el cuestionario' })

  const { hash, salt } = await hashPassword(body.password)
  await env.DB.prepare('UPDATE usuarios SET password_hash = ?, password_salt = ? WHERE id = ?')
    .bind(hash, salt, usuario.id)
    .run()

  // Cupo gratuito: la condición va dentro del UPDATE para que dos registros simultáneos
  // no sobrepasen el cupo.
  let gratis = false
  let codigoUsuario = (usuario.codigo_usuario as string | null) ?? null
  if (!usuario.suscrito) {
    const codigo = codigoUsuario ?? (await generarCodigoUsuario(env.DB))
    const r = await env.DB.prepare(
      `UPDATE usuarios SET suscrito = 1, acceso_gratis = 1, acceso_gratis_en = datetime('now'), codigo_usuario = ?
       WHERE id = ? AND suscrito = 0 AND (SELECT COUNT(*) FROM usuarios WHERE acceso_gratis = 1) < ?`
    )
      .bind(codigo, usuario.id, CUPO_GRATIS)
      .run()
    gratis = (r.meta.changes ?? 0) > 0
    if (gratis) codigoUsuario = codigo
  }

  return { ok: true, gratis, suscrito: gratis || Boolean(usuario.suscrito), codigoUsuario }
})
