// Estado del pago del usuario en sesión. La página /pago lo consulta para saber
// qué modo mostrar (Hotmart o simulado) y, en modo Hotmart, para confirmar si el
// aviso de pago ya llegó (también activa a quien pagó antes de crear su cuenta).

import { CUPO_GRATIS } from '../../shared/utils/cupo'
import { COOKIE_SESION, obtenerUsuarioDeSesion } from '../utils/auth'
import { activarSuscripcion, compraVigente, modoPago, urlCheckout, type EntornoPagos } from '../utils/pagos'

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as EntornoPagos | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const usuario = await obtenerUsuarioDeSesion(env.DB, getCookie(event, COOKIE_SESION))
  if (!usuario) throw createError({ statusCode: 401, statusMessage: 'Sesión no encontrada' })

  const modo = modoPago(env)
  let suscrito = Boolean(usuario.suscrito)
  let codigoUsuario = (usuario.codigo_usuario as string | null) ?? null

  if (modo === 'hotmart' && !suscrito && (await compraVigente(env.DB, String(usuario.email)))) {
    codigoUsuario = await activarSuscripcion(env.DB, usuario.id as number)
    suscrito = true
  }

  const { total } = (await env.DB.prepare('SELECT COUNT(*) AS total FROM usuarios WHERE acceso_gratis = 1').first<{ total: number }>()) ?? { total: 0 }

  return {
    cupoGratisAgotado: total >= CUPO_GRATIS,
    gratis: Boolean(usuario.acceso_gratis),
    modo,
    suscrito,
    codigoUsuario: suscrito ? codigoUsuario : null,
    checkoutUrl: modo === 'hotmart' ? urlCheckout(env) : null,
    email: usuario.email,
    nombre: usuario.nombre,
  }
})
