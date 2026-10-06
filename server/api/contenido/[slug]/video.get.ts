// Video de un contenido (R2: contenidos/<slug>.mp4), solo para suscriptores.
import { servirObjetoR2 } from '../../../utils/r2'
import { usuarioSuscritoParaContenido } from '../../../utils/contenido'

export default defineEventHandler(async (event) => {
  const { slug, env } = await usuarioSuscritoParaContenido(event)
  return servirObjetoR2(event, env.VIDEOS, `contenidos/${slug}.mp4`, {
    tipo: 'video/mp4',
    cache: 'private, max-age=86400',
  })
})
