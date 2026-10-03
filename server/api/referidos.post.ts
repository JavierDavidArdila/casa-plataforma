// Formulario de referidos (al terminar SOSTENER): quién refiere, tres referidos y cómo llegó a C.A.S.A.
// Todos los campos son obligatorios. Solo se guardan; no se envía ningún correo a los referidos.
// Un usuario tiene un solo envío: si vuelve a enviar, reemplaza el anterior.

import { pareceCodigoAcceso, formatearCodigoAcceso, normalizarCodigoAcceso } from '../../shared/utils/codigo-acceso'
import { COOKIE_SESION, obtenerUsuarioDeSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface Persona {
  nombre?: string
  apellido?: string
  email?: string
  celular?: string
}

interface CuerpoReferidos {
  nombre?: string
  apellido?: string
  paisOrigen?: string
  paisResidencia?: string
  referidos?: Persona[]
  comoLlegaste?: string
  clave?: string
}

const limpio = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<CuerpoReferidos>(event)

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })

  const usuario = await obtenerUsuarioDeSesion(env.DB, getCookie(event, COOKIE_SESION))
  if (!usuario) throw createError({ statusCode: 401, statusMessage: 'Sesión no encontrada' })
  if (!usuario.suscrito) throw createError({ statusCode: 403, statusMessage: 'Activa tu suscripción para continuar' })

  const faltan = createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' })

  const nombre = limpio(body?.nombre)
  const apellido = limpio(body?.apellido)
  const paisOrigen = limpio(body?.paisOrigen)
  const paisResidencia = limpio(body?.paisResidencia)
  if (!nombre || !apellido || !paisOrigen || !paisResidencia) throw faltan

  const lista = Array.isArray(body?.referidos) ? body.referidos : []
  if (lista.length !== 3) throw faltan
  const referidos = lista.map((p) => ({
    nombre: limpio(p?.nombre),
    apellido: limpio(p?.apellido),
    email: limpio(p?.email).toLowerCase(),
    celular: limpio(p?.celular, 40),
  }))
  if (referidos.some((r) => !r.nombre || !r.apellido || !r.email || !r.celular)) throw faltan
  if (referidos.some((r) => !EMAIL.test(r.email))) {
    throw createError({ statusCode: 400, statusMessage: 'Revisa los emails de tus referidos' })
  }

  const comoLlegaste = body?.comoLlegaste
  if (comoLlegaste !== 'clave' && comoLlegaste !== 'primeros100') {
    throw createError({ statusCode: 400, statusMessage: 'Cuéntanos cómo llegaste a C.A.S.A.' })
  }
  let clave: string | null = null
  if (comoLlegaste === 'clave') {
    if (!body?.clave || !pareceCodigoAcceso(body.clave)) {
      throw createError({ statusCode: 400, statusMessage: 'La clave no es válida. Revisa que esté escrita igual que en la tarjeta.' })
    }
    clave = formatearCodigoAcceso(normalizarCodigoAcceso(body.clave))
  }

  const db = env.DB
  await db.prepare('DELETE FROM referidos WHERE usuario_id = ?').bind(usuario.id).run()
  await db.prepare('DELETE FROM referidos_envios WHERE usuario_id = ?').bind(usuario.id).run()
  const envio = await db
    .prepare(
      `INSERT INTO referidos_envios (usuario_id, nombre, apellido, pais_origen, pais_residencia, como_llegaste, clave_acceso)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(usuario.id, nombre, apellido, paisOrigen, paisResidencia, comoLlegaste, clave)
    .run()
  const envioId = Number(envio.meta.last_row_id)
  await db.batch(
    referidos.map((r, i) =>
      db
        .prepare('INSERT INTO referidos (envio_id, usuario_id, posicion, nombre, apellido, email, celular) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(envioId, usuario.id, i + 1, r.nombre, r.apellido, r.email, r.celular)
    )
  )

  return { ok: true }
})
