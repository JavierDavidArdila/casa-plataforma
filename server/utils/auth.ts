// Utilidades de autenticación: hash de contraseña (PBKDF2 vía Web Crypto,
// disponible en el runtime de Workers) y manejo de sesiones en D1.

const ITERACIONES_PBKDF2 = 100_000
const DURACION_SESION_DIAS = 90

function bufferAHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function hexABuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  return bytes
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivarHash(password, salt)
  return { hash: bufferAHex(hash), salt: bufferAHex(salt.buffer as ArrayBuffer) }
}

export async function verificarPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const hashCalculado = await derivarHash(password, hexABuffer(salt))
  return bufferAHex(hashCalculado) === hash
}

async function derivarHash(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const claveBase = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: ITERACIONES_PBKDF2, hash: 'SHA-256' },
    claveBase,
    256
  )
}

export function generarToken(): string {
  return bufferAHex(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer)
}

export async function crearSesion(db: D1Database, usuarioId: number): Promise<string> {
  const token = generarToken()
  const expiraEn = new Date(Date.now() + DURACION_SESION_DIAS * 24 * 60 * 60 * 1000).toISOString()
  await db
    .prepare('INSERT INTO sesiones (token, usuario_id, expira_en) VALUES (?, ?, ?)')
    .bind(token, usuarioId, expiraEn)
    .run()
  return token
}

export const COOKIE_SESION = 'casa_session'

export async function obtenerUsuarioDeSesion(
  db: D1Database,
  token: string | undefined
): Promise<Record<string, unknown> | null> {
  if (!token) return null
  const sesion = await db
    .prepare('SELECT usuario_id, expira_en FROM sesiones WHERE token = ?')
    .bind(token)
    .first<{ usuario_id: number; expira_en: string }>()
  if (!sesion) return null
  if (new Date(sesion.expira_en).getTime() < Date.now()) return null
  return db.prepare('SELECT * FROM usuarios WHERE id = ?').bind(sesion.usuario_id).first()
}

// Código de usuario de 6 dígitos (000000-999999, con repetición), asignado
// solo al confirmar la compra/suscripción. Se verifica unicidad contra la
// tabla antes de asignarlo (el espacio permite hasta 1,000,000 de usuarios).
export async function generarCodigoUsuario(db: D1Database): Promise<string> {
  for (let intento = 0; intento < 20; intento++) {
    const codigo = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
    const existente = await db.prepare('SELECT id FROM usuarios WHERE codigo_usuario = ?').bind(codigo).first()
    if (!existente) return codigo
  }
  throw new Error('No se pudo generar un código de usuario único tras varios intentos')
}

// Datos del acceso de invitado/prensa al que pertenece la sesión (null si es un usuario normal).
export interface ContextoAcceso {
  usuarioId: number
  accesoId: number
  codigoId: number
  tipo: string
  venceEn: string
}

export async function obtenerContextoAcceso(db: D1Database, token: string | undefined): Promise<ContextoAcceso | null> {
  if (!token) return null
  const fila = await db
    .prepare(
      `SELECT s.usuario_id, s.acceso_id, s.expira_en, a.codigo_id, a.tipo
       FROM sesiones s JOIN accesos_log a ON a.id = s.acceso_id
       WHERE s.token = ? AND s.acceso_id IS NOT NULL`
    )
    .bind(token)
    .first<{ usuario_id: number; acceso_id: number; expira_en: string; codigo_id: number; tipo: string }>()
  if (!fila || new Date(fila.expira_en).getTime() < Date.now()) return null
  return { usuarioId: fila.usuario_id, accesoId: fila.acceso_id, codigoId: fila.codigo_id, tipo: fila.tipo, venceEn: fila.expira_en }
}

// Recuperar contraseña: en la base solo queda el SHA-256 del token que viaja en el correo.
export async function hashToken(token: string): Promise<string> {
  return bufferAHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))
}
