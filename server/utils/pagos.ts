// Pasarela de pago: Hotmart, detrás de un interruptor.
//
// Interruptor: el secreto HOTMART_HOTTOK. Sin él, la plataforma sigue en modo
// "simulado" (/api/pago activa la suscripción sin cobrar). Con él, el único
// camino para activar una suscripción es el aviso firmado de Hotmart (/api/hotmart).
//   npx wrangler secret put HOTMART_HOTTOK
// Opcional: HOTMART_CHECKOUT_URL (variable) para cambiar el link de pago sin desplegar.

import { generarCodigoUsuario } from './auth'

export interface EntornoPagos {
  DB: D1Database
  HOTMART_HOTTOK?: string
  HOTMART_CHECKOUT_URL?: string
}

export const CHECKOUT_HOTMART_POR_DEFECTO = 'https://pay.hotmart.com/J107793569C'

export const EVENTOS_APROBADO = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']
export const EVENTOS_REVOCADO = ['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK']

export function modoPago(env: EntornoPagos): 'hotmart' | 'simulado' {
  return env.HOTMART_HOTTOK ? 'hotmart' : 'simulado'
}

export function urlCheckout(env: EntornoPagos): string {
  return env.HOTMART_CHECKOUT_URL || CHECKOUT_HOTMART_POR_DEFECTO
}

// Comparación en tiempo constante del token de Hotmart.
export async function hottokValido(recibido: string | undefined, esperado: string): Promise<boolean> {
  if (!recibido) return false
  const enc = new TextEncoder()
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(recibido)),
    crypto.subtle.digest('SHA-256', enc.encode(esperado)),
  ])
  const va = new Uint8Array(a)
  const vb = new Uint8Array(b)
  let diff = 0
  for (let i = 0; i < va.length; i++) diff |= va[i]! ^ vb[i]!
  return diff === 0
}

export async function activarSuscripcion(db: D1Database, usuarioId: number): Promise<string> {
  const usuario = await db.prepare('SELECT codigo_usuario FROM usuarios WHERE id = ?').bind(usuarioId).first<{ codigo_usuario: string | null }>()
  const codigo = usuario?.codigo_usuario || (await generarCodigoUsuario(db))
  await db.prepare('UPDATE usuarios SET suscrito = 1, codigo_usuario = ? WHERE id = ?').bind(codigo, usuarioId).run()
  return codigo
}

export async function desactivarSuscripcion(db: D1Database, usuarioId: number) {
  await db.prepare('UPDATE usuarios SET suscrito = 0 WHERE id = ?').bind(usuarioId).run()
}

// ¿El último aviso de Hotmart para este email deja la compra vigente?
export async function compraVigente(db: D1Database, email: string): Promise<boolean> {
  const marcas = [...EVENTOS_APROBADO, ...EVENTOS_REVOCADO].map(() => '?').join(',')
  const ultimo = await db
    .prepare(`SELECT evento FROM pagos_hotmart WHERE email = ? AND evento IN (${marcas}) ORDER BY id DESC LIMIT 1`)
    .bind(email.toLowerCase(), ...EVENTOS_APROBADO, ...EVENTOS_REVOCADO)
    .first<{ evento: string }>()
  return Boolean(ultimo && EVENTOS_APROBADO.includes(ultimo.evento))
}
