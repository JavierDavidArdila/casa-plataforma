import { PILARES, type Pilar } from './test-bienestar'

export interface VideoContenido {
  slug: string
  pilar: Pilar
  numero: string
  titulo: string
  descripcion: string
}

const ORDEN: Pilar[] = ['COMPRENDER', 'ACOMPANAR', 'SOSTENER', 'ALIVIAR']

export const VIDEOS: VideoContenido[] = ORDEN.map((pilar, i) => ({
  slug: pilar.toLowerCase(),
  pilar,
  numero: `Video 0${i + 1}`,
  titulo: PILARES[pilar].nombre,
  descripcion: PILARES[pilar].descripcion,
}))

export function obtenerVideo(slug: string) {
  return VIDEOS.find((v) => v.slug === slug) ?? null
}

export function obtenerSiguienteVideo(slug: string) {
  const indice = VIDEOS.findIndex((v) => v.slug === slug)
  if (indice === -1) return null
  return VIDEOS[(indice + 1) % VIDEOS.length]
}
