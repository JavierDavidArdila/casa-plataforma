// Entradas reales de prensa, portadas de ahorasoypapademispapas.com/prensa
// (content/prensa/*.md) — mismo contenido, agrupado por medio como en el sitio
// original en vez de por tipo (el mockup de Figma agrupaba por tipo, pero los
// datos reales no distinguen entrevista/nota/podcast, solo el medio).
export interface EntradaPrensa {
  grupo: string
  subtitulo?: string
  medio: string
  fecha: string
  titular: string
  imagen: string
  url: string
}

export const PRENSA: EntradaPrensa[] = [
  { grupo: 'RCN', subtitulo: 'Voces RCN', medio: 'Voces RCN', fecha: '2021-10-22', titular: 'Voces RCN: Ahora soy papá de mis papás', imagen: '/images/prensa/rcn-voces-oct22.jpg', url: 'https://radiocut.fm/audiocut/voces-rcn-ahora-soy-papa-mis-papas/' },
  { grupo: 'Blu radio', subtitulo: 'En Blu Jeans', medio: 'Blu Radio', fecha: '2021-10-31', titular: 'En Blu Jeans: la experiencia de cuidar a un padre mayor', imagen: '/images/prensa/blu-jeans-oct31.jpg', url: 'https://www.bluradio.com/en-blu-jeans/31-de-octubre-de-2021-en-blu-jeans-programa-completo' },
  { grupo: 'W Radio', medio: 'W Radio', fecha: '2021-11-02', titular: 'El libro que plantea lo que significa asumir con éxito la vejez de sus padres', imagen: '/images/prensa/w-radio-nov2.jpg', url: 'https://www.wradio.com.co/noticias/actualidad/el-libro-que-plantea-lo-que-significa-asumir-con-exito-la-vejez-de-sus-padres/20211102/nota/4175456.aspx' },
  { grupo: 'Caracol Radio', subtitulo: 'En Armonía', medio: 'Caracol Radio', fecha: '2021-11-08', titular: '¿Qué hacer cuando nos convertimos en los papás de nuestros papás?', imagen: '/images/prensa/caracol-armonia-nov8.jpg', url: 'https://caracol.com.co/programa/2021/11/08/en_armonia/1636375785_100729.html' },
  { grupo: 'Mañanas Latinas', subtitulo: 'Rep. Dominicana', medio: 'Mañanas Latinas', fecha: '2021-12-22', titular: 'Mañanas Latinas — República Dominicana', imagen: '/images/prensa/mananas-latinas-dic22.png', url: 'https://www.youtube.com/watch?v=gunTW_7N1KM' },
  { grupo: 'Colsanitas', medio: 'Colsanitas', fecha: '2022-05-06', titular: 'Cuidar a nuestros padres es mejorarnos a nosotros mismos', imagen: '/images/prensa/colsanitas-may6.jpg', url: 'https://www.bienestarcolsanitas.com/articulo/cuidar-a-nuestros-padres-es-mejorarnos-a-nosotros-mismos' },
  { grupo: 'Blu radio', subtitulo: 'En Blu Jeans', medio: 'Blu Radio', fecha: '2022-08-21', titular: 'En Blu Jeans: preparación y prevención en el cuidado familiar', imagen: '/images/prensa/blu-jeans-ago21.png', url: 'https://www.bluradio.com/en-blu-jeans/21-de-agosto-de-2022-en-blu-jeans-programa-completo-pr30' },
  { grupo: 'RCN', medio: 'RCN', fecha: '2022-09-01', titular: 'Hay que trabajar en la prevención temprana del Alzheimer: experto Fernando Roca', imagen: '/images/prensa/rcn-sep1.png', url: 'https://www.youtube.com/watch?v=-aQihbNpTfc' },
  { grupo: 'Caracol Radio', medio: 'Caracol Radio', fecha: '2022-11-25', titular: 'La importancia de la nutrición en pacientes oncológicos', imagen: '/images/prensa/caracol-nov25.jpg', url: 'https://caracol.com.co/2022/11/25/la-importancia-de-la-nutricion-en-pacientes-oncologicos/' },
  { grupo: 'El Empleo', medio: 'El Empleo', fecha: '2022-11-30', titular: 'La salud mental de los cuidadores de adultos mayores, un tema del que no se habla', imagen: '/images/prensa/el-empleo-nov30.jpg', url: 'https://www.elempleo.com/co/noticias/noticias-laborales/la-salud-mental-de-los-cuidadores-de-adultos-mayores-un-tema-del-que-no-se-habla-7045' },
  { grupo: 'Semana', medio: 'Semana', fecha: '2022-12-01', titular: 'Cuidar a los cuidadores de pacientes totalmente dependientes', imagen: '/images/prensa/semana-dic1.jpg', url: 'https://www.semana.com/salud/articulo/cuidar-a-los-cuidadores-de-pacientes-totalmente-dependientes-el-reto-para-esta-navidad/202252/' },
  { grupo: 'RCN', subtitulo: 'LAFM', medio: 'LAFM', fecha: '2022-12-07', titular: 'Salud mental de los cuidadores de personas adultas está en la mira', imagen: '/images/prensa/lafm-dic7.jpg', url: 'https://www.lafm.com.co/sociedad/salud-mental-de-los-cuidadores-de-personas-adultas-esta-en-la-mira-296077' },
  { grupo: 'Blu radio', subtitulo: 'Casa Blu', medio: 'Blu Radio', fecha: '2023-01-07', titular: 'Casa Blu: cómo cuidar a los padres', imagen: '/images/prensa/blu-casa-blu-ene7.jpg', url: 'https://www.bluradio.com/casa-blu/como-cuidar-a-los-padres-casa-blu-programa-completo-del-7-de-enero-de-2023-pr30' },
  { grupo: 'Spotify', medio: 'Spotify', fecha: '2024-07-17', titular: 'Hablemos del Alzheimer', imagen: '/images/prensa/spotify.png', url: 'https://open.spotify.com/episode/7oGEqz5vLMNYhTah7tcRak' },
]

export function agruparPrensaPorMedio(entradas: EntradaPrensa[]) {
  const orden = ['RCN', 'Blu radio', 'W Radio', 'Caracol Radio', 'Mañanas Latinas', 'Colsanitas', 'El Empleo', 'Semana', 'Spotify']
  return orden
    .map((grupo) => ({ grupo, entradas: entradas.filter((e) => e.grupo === grupo).sort((a, b) => b.fecha.localeCompare(a.fecha)) }))
    .filter((g) => g.entradas.length > 0)
}
