// Embudo anónimo de visitas: páginas vistas y pasos del registro de cualquier visitante.
// Guarda solo un id aleatorio del navegador, el evento, la ruta, el origen (utm/referrer),
// el país que da Cloudflare y si es móvil o escritorio. Ignora bots. Siempre responde 204.

interface CloudflareEnv {
  DB: D1Database
}

const EVENTOS = new Set([
  'pagina',
  'video_bienvenida',
  'registro_enviado',
  'registro_ok',
  'registro_error',
  'test_inicio',
  'test_fin',
  'cuenta_ok',
])
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|curl|wget|python|node-fetch/i
const texto = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : null)

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 204)
  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  const body = await readBody<{ visitante?: string; evento?: string; ruta?: string; origen?: string }>(event).catch(() => null)
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  const visitante = texto(body?.visitante, 40)
  if (!env?.DB || !visitante || !body?.evento || !EVENTOS.has(body.evento) || BOT.test(ua)) return null

  const cf = (event.context.cloudflare as { request?: { cf?: Record<string, unknown> } } | undefined)?.request?.cf ?? {}
  try {
    await env.DB.prepare('INSERT INTO embudo (visitante, evento, ruta, origen, pais, dispositivo) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(visitante, body.evento, texto(body.ruta, 200), texto(body.origen, 120), texto(cf.country, 8), /mobi|android|iphone|ipad/i.test(ua) ? 'movil' : 'escritorio')
      .run()
  } catch (e) {
    console.error('No se pudo guardar el evento del embudo (¿falta migrations/0009?):', e)
  }
  return null
})
