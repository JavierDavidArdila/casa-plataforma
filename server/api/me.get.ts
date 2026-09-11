import { COOKIE_SESION, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) return { autenticado: false }

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)
  if (!usuario) return { autenticado: false }

  return {
    autenticado: true,
    suscrito: Boolean(usuario.suscrito),
    codigoUsuario: usuario.codigo_usuario ?? null,
    nombre: usuario.nombre,
    tieneCuenta: Boolean(usuario.password_hash),
  }
})
