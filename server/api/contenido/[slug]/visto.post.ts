// El usuario terminó el video del contenido.
import { marcarPaso, usuarioSuscritoParaContenido } from '../../../utils/contenido'

export default defineEventHandler(async (event) => {
  const { slug, env, usuario } = await usuarioSuscritoParaContenido(event)
  await marcarPaso(env.DB, Number(usuario.id), slug, 'visto')
  return { ok: true }
})
