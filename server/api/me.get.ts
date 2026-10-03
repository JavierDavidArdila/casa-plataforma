import { COOKIE_SESION, obtenerContextoAcceso, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) return { autenticado: false }

  const token = getCookie(event, COOKIE_SESION)
  const usuario = await obtenerUsuarioDeSesion(env.DB, token)
  if (!usuario) return { autenticado: false }

  // Invitados y prensa: tipo de acceso, cuándo vence y de qué videos ya dieron su opinión.
  const acceso = await obtenerContextoAcceso(env.DB, token).catch(() => null)
  let opinionesEnviadas: string[] = []
  if (acceso) {
    const { results } = await env.DB.prepare('SELECT video FROM opiniones_acceso WHERE usuario_id = ?')
      .bind(acceso.usuarioId)
      .all<{ video: string }>()
    opinionesEnviadas = results.map((r) => r.video)
  }

  const referidos = await env.DB.prepare('SELECT 1 AS ok FROM referidos_envios WHERE usuario_id = ?')
    .bind(usuario.id)
    .first()
    .catch(() => null)

  return {
    autenticado: true,
    referidosEnviados: Boolean(referidos),
    suscrito: Boolean(usuario.suscrito),
    codigoUsuario: usuario.codigo_usuario ?? null,
    nombre: usuario.nombre,
    tieneCuenta: Boolean(usuario.password_hash),
    tipoAcceso: acceso?.tipo ?? null,
    venceEn: acceso?.venceEn ?? null,
    opinionesEnviadas,
  }
})
