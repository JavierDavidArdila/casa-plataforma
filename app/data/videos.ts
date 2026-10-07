import { PILARES, type Pilar } from './test-bienestar'

export interface VideoContenido {
  slug: string
  pilar: Pilar
  numero: string
  titulo: string
  descripcion: string
  /** Texto para el usuario (Word del 30 sep 2026). */
  texto: string
  /** Publicado: los demás se muestran como "Pronto" y su página redirige al inicio. */
  disponible: boolean
  /** Imagen de la tarjeta en el home; sin ella se usa la genérica de VideoCard. */
  imagen?: string
}

const ORDEN: Pilar[] = ['COMPRENDER', 'ACOMPANAR', 'SOSTENER', 'ALIVIAR']

// Por ahora solo está publicado COMPRENDER (pedido del cliente, 5 oct 2026).
const DISPONIBLES: Pilar[] = ['COMPRENDER']

const TEXTOS: Record<Pilar, string> = {
  COMPRENDER: 'Aquí entenderás mejor tu realidad y tus límites. Luego descarga el material de apoyo para poner todo en práctica.',
  ACOMPANAR: 'A cuidarte a ti mismo(a). Y descarga el material de apoyo para practicar cómo cuidarte.',
  SOSTENER: 'Aprenderás a manejar tus emociones para continuar cuidando. Y con el material de apoyo descargable lo harás más práctico.',
  ALIVIAR: 'En este espacio aprenderás nuevamente a darle espacio a la vida y a ponerlo en blanco y negro con el material de apoyo descargable.',
}

// Imágenes enviadas por el cliente el 7 oct 2026.
const IMAGENES: Record<Pilar, string> = {
  COMPRENDER: '/images/contenidos/comprender.jpg',
  ACOMPANAR: '/images/contenidos/aprender.jpg',
  SOSTENER: '/images/contenidos/sostener.jpg',
  ALIVIAR: '/images/contenidos/aliviar.jpg',
}

export const VIDEOS: VideoContenido[] = ORDEN.map((pilar, i) => ({
  slug: pilar === 'ACOMPANAR' ? 'aprender' : pilar.toLowerCase(),
  pilar,
  numero: `Video 0${i + 1}`,
  titulo: PILARES[pilar].nombre,
  descripcion: PILARES[pilar].descripcion,
  texto: TEXTOS[pilar],
  disponible: DISPONIBLES.includes(pilar),
  imagen: IMAGENES[pilar],
}))

export function obtenerVideo(slug: string) {
  return VIDEOS.find((v) => v.slug === slug) ?? null
}

export function obtenerSiguienteVideo(slug: string) {
  const indice = VIDEOS.findIndex((v) => v.slug === slug)
  if (indice === -1) return null
  return VIDEOS[(indice + 1) % VIDEOS.length]
}
