// Paso 1 del flujo: pre-inscripción antes del test. Crea (o actualiza, si ya
// existía por email) un registro en `usuarios` sin contraseña ni código
// todavía, y abre una sesión para poder enlazar el test y los pasos
// siguientes a este mismo usuario.

import { COOKIE_SESION, crearSesion } from '../utils/auth'

interface CloudflareEnv {
  DB: D1Database
}

interface CuerpoLead {
  nombre?: string
  apellido?: string
  edad?: number | string
  fechaNacimiento?: string
  genero?: string
  email?: string
  movil?: string
  paisOrigen?: string
  paisResidencia?: string
  ciudad?: string
  empresa?: string
  aQuienAyudas?: string
  haceCuantoVivesFuera?: number | string
  aniosCuidando?: number | string
  aceptaComunicaciones?: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CuerpoLead>(event)

  if (!body?.nombre || !body?.email) {
    throw createError({ statusCode: 400, statusMessage: 'Nombre y email son obligatorios' })
  }

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) {
    throw createError({ statusCode: 500, statusMessage: 'Base de datos no disponible' })
  }

  const acepta = body.aceptaComunicaciones === true ? 1 : 0

  const existente = await env.DB.prepare('SELECT id FROM usuarios WHERE email = ?')
    .bind(body.email)
    .first<{ id: number }>()

  let usuarioId: number

  if (existente) {
    usuarioId = existente.id
    await env.DB.prepare(
      `UPDATE usuarios SET nombre = ?, apellido = ?, edad = ?, fecha_nacimiento = ?, genero = ?,
        movil = ?, pais_origen = ?, pais_residencia = ?, ciudad = ?, a_quien_ayudas = ?,
        hace_cuanto_vives_fuera = ?, anios_cuidando = ?, empresa = ?,
        acepta_comunicaciones = ?, acepta_comunicaciones_en = ? WHERE id = ?`
    )
      .bind(
        body.nombre,
        body.apellido ?? '',
        Number(body.edad) || null,
        body.fechaNacimiento ?? '',
        body.genero ?? '',
        body.movil ?? '',
        body.paisOrigen ?? '',
        body.paisResidencia ?? '',
        body.ciudad ?? '',
        body.aQuienAyudas ?? '',
        String(body.haceCuantoVivesFuera ?? ''),
        String(body.aniosCuidando ?? ''),
        body.empresa ?? '',
        acepta,
        acepta ? new Date().toISOString() : null,
        usuarioId
      )
      .run()
  } else {
    const resultado = await env.DB.prepare(
      `INSERT INTO usuarios
        (nombre, apellido, edad, fecha_nacimiento, genero, email, movil, pais_origen,
         pais_residencia, ciudad, a_quien_ayudas, hace_cuanto_vives_fuera, anios_cuidando, empresa,
         acepta_comunicaciones, acepta_comunicaciones_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        body.nombre,
        body.apellido ?? '',
        Number(body.edad) || null,
        body.fechaNacimiento ?? '',
        body.genero ?? '',
        body.email,
        body.movil ?? '',
        body.paisOrigen ?? '',
        body.paisResidencia ?? '',
        body.ciudad ?? '',
        body.aQuienAyudas ?? '',
        String(body.haceCuantoVivesFuera ?? ''),
        String(body.aniosCuidando ?? ''),
        body.empresa ?? '',
        acepta,
        acepta ? new Date().toISOString() : null
      )
      .run()
    usuarioId = resultado.meta.last_row_id as number
  }

  const token = await crearSesion(env.DB, usuarioId)
  setCookie(event, COOKIE_SESION, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  })

  return { ok: true }
})
