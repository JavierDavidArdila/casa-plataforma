// Guía descargable (PDF) de un contenido (R2: guias/<slug>.pdf), solo para suscriptores.
// Al descargarla queda marcado el paso "guia" del recorrido.
import { servirObjetoR2 } from '../../../utils/r2'
import { marcarPaso, usuarioSuscritoParaContenido } from '../../../utils/contenido'

export default defineEventHandler(async (event) => {
  const { slug, env, usuario } = await usuarioSuscritoParaContenido(event)
  if (event.method === 'GET') {
    await marcarPaso(env.DB, Number(usuario.id), slug, 'guia').catch((e) => console.error('No se pudo marcar la guía:', e))
  }
  return servirObjetoR2(event, env.VIDEOS, `guias/${slug}.pdf`, {
    tipo: 'application/pdf',
    cache: 'private, max-age=86400',
    descarga: `CASA-${slug}-guia.pdf`,
  })
})
