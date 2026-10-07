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
    imagen: '/images/prensa/press-tour-planeta.jpg',
    descripcion:
      'Iniciamos en Despierta América de Univisión con dos cuidadores excepcionales de sus padres: Raúl Martínez González y Karla Martínez, con quienes compartimos cómo cuidarlos de cerca y a la distancia, cómo cuidarnos y tener todos envejecimiento activo.',
  },
]
