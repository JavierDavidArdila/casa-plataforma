// Prensa de C.A.S.A. (Word "Textos plataforma Web C.A.S.A.", 30 sep 2026). El cliente pidió quitar
// las notas de ¡Ahora soy papá de mis papás! y llenar esta sección solo con las de C.A.S.A.
// a medida que lleguen. Una entrada sin `url` se muestra como "Próximamente".
export interface EntradaPrensa {
  titulo: string
  descripcion: string
  imagen?: string
  url?: string
}

export const PRENSA_INTRO = 'Aquí puedes ver o escuchar las principales entrevistas de los medios a que hemos sido invitados.'

export const PRENSA: EntradaPrensa[] = [
  {
    titulo: 'Todo comenzó con un encuentro de hijos que hablaban de sus mamás ante las cámaras.',
    descripcion: 'Jorge Ramos y Fernando Roca.',
    imagen: '/images/prensa/jorge-ramos-entrevista.jpg',
    url: 'https://www.youtube.com/watch?v=cUYoAXlBMWU',
  },
  {
    titulo: 'Press Tour Planeta',
    imagen: '/images/figma/hero-prensa.jpg',
    descripcion:
      'Conoce pronto las principales entrevistas que Grupo Planeta organizó con Fernando Roca, autor de ¡Ahora soy papá de mis papás! y C.A.S.A.',
  },
]
