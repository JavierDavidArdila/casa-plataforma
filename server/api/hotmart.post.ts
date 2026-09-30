// Aviso (webhook) de Hotmart. Hotmart lo llama cuando cambia el estado de una compra.
// Seguridad: se exige el header X-HOTMART-HOTTOK igual al secreto HOTMART_HOTTOK.
// Responde 200 a lo que no le interesa para que Hotmart no reintente; 401 si el
// token es incorrecto; 503 si la pasarela no está configurada (Hotmart reintentará).

import {
  EVENTOS_APROBADO,
  EVENTOS_REVOCADO,
  activarSuscripcion,
  desactivarSuscripcion,
  hottokValido,
  type EntornoPagos,
} from '../utils/pagos'

interface AvisoHotmart {
  event?: string
  data?: {
    buyer?: { email?: string }
    purchase?: { transaction?: string }
  }
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as EntornoPagos | undefined
  if (!env?.DB || !env.HOTMART_HOTTOK) throw createError({ statusCode: 503, statusMessage: 'Pasarela no configurada' })

  const token = getHeader(event, 'x-hotmart-hottok')
  if (!(await hottokValido(token, env.HOTMART_HOTTOK))) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
  }

  const aviso = await readBody<AvisoHotmart>(event).catch(() => null)
  const evento = aviso?.event ?? ''
  const email = aviso?.data?.buyer?.email?.trim().toLowerCase()
  const transaccion = aviso?.data?.purchase?.transaction

  if (!email || !transaccion || ![...EVENTOS_APROBADO, ...EVENTOS_REVOCADO].includes(evento)) {
    return { ok: true, ignorado: true }
  }

  const usuario = await env.DB.prepare('SELECT id FROM usuarios WHERE lower(email) = ?').bind(email).first<{ id: number }>()

  // INSERT OR IGNORE: si Hotmart reintenta el mismo aviso no se procesa dos veces.
  const guardado = await env.DB.prepare(
    'INSERT OR IGNORE INTO pagos_hotmart (transaccion, evento, email, usuario_id, payload) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(transaccion, evento, email, usuario?.id ?? null, JSON.stringify(aviso))
    .run()
  if (!guardado.meta.changes) return { ok: true, repetido: true }

  // Si aún no hay cuenta con ese email, queda registrado y se activa cuando la cree (/api/pago-estado).
  if (usuario) {
    if (EVENTOS_APROBADO.includes(evento)) await activarSuscripcion(env.DB, usuario.id)
    else await desactivarSuscripcion(env.DB, usuario.id)
  }

  return { ok: true }
})
