// Pago SIMULADO: no hay pasarela real conectada todavía. Este endpoint
// activa la suscripción y asigna el código de usuario de 6 dígitos, que es
// lo que necesita el negocio ya mismo. Cuando se elija la pasarela real,
// esto se reemplaza por la confirmación que llegue vía webhook.

import { COOKIE_SESION, generarCodigoUsuario, obtenerUsuarioDeSesion } from '../utils/auth'
import { modoPago, type EntornoPagos } from '../utils/pagos'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ incluyeLibro?: boolean }>(event).catch(() => ({}))

  const env = event.context.cloudflare?.env as EntornoPagos | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })
  // Con Hotmart activo, la suscripción solo la activa el aviso firmado de Hotmart.
  if (modoPago(env) === 'hotmart') throw createError({ statusCode: 403, statusMessage: 'El pago se confirma a través de Hotmart' })

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)
  if (!usuario) throw createError({ statusCode: 401, statusMessage: 'Sesión no encontrada, vuelve a empezar el cuestionario' })

  let codigoUsuario = usuario.codigo_usuario as string | null
  if (!codigoUsuario) {
    codigoUsuario = await generarCodigoUsuario(env.DB)
  }

  await env.DB.prepare('UPDATE usuarios SET suscrito = 1, incluye_libro = ?, codigo_usuario = ? WHERE id = ?')
    .bind(body?.incluyeLibro ? 1 : 0, codigoUsuario, usuario.id)
    .run()

  return { ok: true, codigoUsuario }
})
