import { COOKIE_SESION } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  const token = getCookie(event, COOKIE_SESION)
  if (env?.DB && token) {
    await env.DB.prepare('DELETE FROM sesiones WHERE token = ?').bind(token).run()
  }
  deleteCookie(event, COOKIE_SESION, { path: '/' })
  return { ok: true }
})
