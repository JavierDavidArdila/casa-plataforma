// En qué paso va el usuario en un contenido: video visto, guía descargada, preguntas respondidas.
import { usuarioSuscritoParaContenido } from '../../../utils/contenido'

export default defineEventHandler(async (event) => {
  const { slug, env, usuario } = await usuarioSuscritoParaContenido(event)
  const fila = await env.DB.prepare(
    'SELECT visto_en, guia_en, preguntas_en, correo_enviado_en FROM progreso_contenido WHERE usuario_id = ? AND video = ?'
  )
    .bind(usuario.id, slug)
    .first<{ visto_en: string | null; guia_en: string | null; preguntas_en: string | null; correo_enviado_en: string | null }>()
    .catch(() => null)
  return {
    visto: Boolean(fila?.visto_en),
    guia: Boolean(fila?.guia_en),
    preguntas: Boolean(fila?.preguntas_en),
    correoEnviado: Boolean(fila?.correo_enviado_en),
  }
})
