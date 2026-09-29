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

// Librerías de Estados Unidos y Canadá (logos blancos enviados por el cliente el 28 sep).
// El texto de la columna todavía no llega: mientras esté vacío solo se muestran los logos.
export const TEXTO_USA = ''

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
