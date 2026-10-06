import type { H3Event } from 'h3'
import { COOKIE_SESION, obtenerUsuarioDeSesion } from './auth'

// Contenidos publicados (mismo criterio que `disponible` en app/data/videos.ts).
export const CONTENIDOS_DISPONIBLES = ['comprender'] as const

export interface EnvContenido {
  DB: D1Database
  VIDEOS: R2Bucket
  EMAIL?: SendEmail
}

// Valida que el contenido esté publicado y que la sesión sea de un usuario suscrito.
export async function usuarioSuscritoParaContenido(event: H3Event) {
  const slug = getRouterParam(event, 'slug') ?? ''
  if (!(CONTENIDOS_DISPONIBLES as readonly string[]).includes(slug)) throw createError({ statusCode: 404 })

  const env = event.context.cloudflare?.env as EnvContenido | undefined
  if (!env?.DB || !env.VIDEOS) throw createError({ statusCode: 503, statusMessage: 'Servicio no disponible' })

  const usuario = await obtenerUsuarioDeSesion(env.DB, getCookie(event, COOKIE_SESION))
  if (!usuario?.suscrito) throw createError({ statusCode: 401, statusMessage: 'Necesitas una suscripción activa.' })
  return { slug, env, usuario }
}

export type PasoProgreso = 'visto' | 'guia' | 'preguntas'

const COLUMNA_PASO: Record<PasoProgreso, string> = { visto: 'visto_en', guia: 'guia_en', preguntas: 'preguntas_en' }

// Marca un paso del recorrido de un contenido (solo la primera vez).
export async function marcarPaso(db: D1Database, usuarioId: number, video: string, paso: PasoProgreso) {
  const columna = COLUMNA_PASO[paso]
  await db
    .prepare(
      `INSERT INTO progreso_contenido (usuario_id, video, ${columna}) VALUES (?, ?, datetime('now'))
       ON CONFLICT (usuario_id, video) DO UPDATE SET ${columna} = COALESCE(${columna}, datetime('now'))`
    )
    .bind(usuarioId, video)
    .run()
}
