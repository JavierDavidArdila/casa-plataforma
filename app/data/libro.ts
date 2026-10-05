// Datos reales del libro, portados de ahorasoypapademispapas.com/libro
// (content/servicios/libro.md). Las URLs de tiendas están vacías porque el
// cliente todavía no las ha compartido (igual que en el sitio original): el
// logo se muestra siempre, y solo se vuelve enlace cuando `url` esté definido.
export const LIBRO = {
  titulo: '¡Ahora soy papá de mis papás!',
  autor: 'Fernando Roca Correa',
  imagen: '/images/servicios/libro.png',
  intro:
    'Es un libro de preparación y prevención. El único libro guía escrito en Iberoamérica desde la experiencia del cuidador, dando una vivencia más realista para quienes son o serán cuidadores o encargados de sus padres. Brinda las herramientas para prepararse y encargarse de forma asertiva en temas clave del cuidado de los padres en la vejez como:',
  bullets: ['Salud', 'Familia y entorno', 'Finanzas', 'Seguridad', 'Temas legales', 'Alzheimer y otras enfermedades mentales', 'El hogar geriátrico', 'El Cuidador'],
  cierre:
    'Disponible en edición impresa y digital. El E-Book se encuentra en Amazon, Apple y Google a nivel mundial. Publicado por el reconocido Grupo Planeta y su sello de autogestión Diana, fue lanzado a finales de 2021 y ha tenido un gran éxito editorial y es Best Seller de Bienestar gracias a la gran aceptación del público.',
  comprarHref: 'https://ahorasoypapademispapas.david-ardila.workers.dev/libro#donde-comprar',
}

export const TIENDAS_COLOMBIA = [
  { nombre: 'Librería Nacional', logo: '/images/tienda/libreria-nacional.png', url: '' },
  { nombre: 'Panamericana', logo: '/images/tienda/panamericana.png', url: '' },
  { nombre: 'Librería Lerner', logo: '/images/tienda/libreria-lerner.png', url: '' },
]

// Ecuador y resto de Latinoamérica (van en la misma columna que Colombia).
export const TIENDAS_LATINOAMERICA = [
  { nombre: 'LibriMundi', logo: '/images/tienda/librimundi.png', url: '' },
  { nombre: 'Librería Española', logo: '/images/tienda/libreria-espanola.png', url: '' },
  { nombre: 'Mr. Books', logo: '/images/tienda/mr-books.png', url: '' },
  { nombre: 'Buscalibre', logo: '/images/tienda/buscalibre.png', url: '' },
]

// Textos de cada edición (Word "Textos plataforma Web C.A.S.A.", 30 sep 2026).
// `resumen` va en la tarjeta del Home; `parrafos`, en la página de Libros.
export const EDICION_COLOMBIA = {
  resumen: 'Preparación y prevención: el único libro guía escrito en Iberoamérica desde la experiencia real de un cuidador.',
  segundaEdicion: 'Ya está en su segunda edición.',
}

export const EDICION_USA = {
  resumen:
    '¿Cómo cuidar de los padres durante su vejez, incluso desde la distancia? La edición especial para Norteamérica, creada para los cuidadores hispanos que tienen a sus padres en sus países de origen.',
  parrafos: [
    '¿Cómo cuidar de los padres durante su vejez, incluso desde la distancia?',
    'Esta gran pregunta que encierra grandes emociones, responsabilidades morales y desafíos físicos y económicos, tiene respuesta en la edición especial para Norteamérica. Esta guía para cuidar a la distancia fue creada para los cuidadores hispanos que tienen a sus padres en sus países de origen.',
    'Como lo dice el reconocido periodista Jorge Ramos en el prólogo de este libro: “los que alguna vez decidimos irnos de nuestro país tenemos un doble reto: abrirnos nuevos caminos y cuidar de los que dejamos atrás. Y eso es muy difícil. No solo porque cada vez hay más restricciones para que los inmigrantes viajen libremente sino porque cuidar a alguien desde otro país requiere mucho cariño, dinero, creatividad y fuerza de voluntad”.',
    'En ¡Ahora soy papá de mis papás!, Fernando Roca reúne el conocimiento y experiencia de profesionales de la salud y del cuidado gerontológico, con las vivencias de una treintena de personas que un día emigraron a Estados Unidos y Canadá y que se han visto en la necesidad de acompañar la vejez de sus padres, ya sea porque viven con ellos o porque los dejaron en sus países de origen.',
    '¿Cómo repartir los cuidados? ¿Qué hacer en caso de Alzheimer? ¿Cómo lidiar de lejos con los conflictos familiares en torno al cuidado? ¿Qué recursos existen para atender las exigencias de esta etapa?',
    'Estas y muchas más dudas son resueltas con ayuda de expertos a través de una prosa entretenida y un optimismo contagioso que, si bien no niega las dificultades naturales de este proceso, abre un panorama positivo para acompañar a la distancia con más amor y eficiencia a quienes un día nos llevaron de la mano.',
  ],
}

// Librerías de Estados Unidos y Canadá (logos blancos enviados por el cliente el 28 sep).
export const TEXTO_USA = 'Ya está a la venta. Disponible en tiendas y plataformas.'

export const TIENDAS_USA = [
  { nombre: 'Amazon', logo: '/images/tienda/usa-amazon.png', url: '' },
  { nombre: 'Barnes & Noble', logo: '/images/tienda/usa-barnes-noble.png', url: '' },
  { nombre: 'Books-A-Million', logo: '/images/tienda/usa-books-a-million.png', url: '' },
  { nombre: 'Bookshop.org', logo: '/images/tienda/usa-bookshop.png', url: '' },
  { nombre: 'Walmart', logo: '/images/tienda/usa-walmart.png', url: '' },
]

export const TIENDAS_EBOOK = [
  { nombre: 'Amazon', logo: '/images/tienda/amazon.png', url: '' },
  { nombre: 'Apple Books', logo: '/images/tienda/apple-books.png', url: '' },
  { nombre: 'Google', logo: '/images/tienda/google.png', url: '' },
]
