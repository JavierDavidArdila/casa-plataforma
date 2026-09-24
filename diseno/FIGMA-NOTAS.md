# Notas del Figma "CASA Web (copia)"

Archivo: https://www.figma.com/design/e07hMTAYsCpvUolUglibvg/CASA-Web--copia-  (fileKey `e07hMTAYsCpvUolUglibvg`)
Capturado el 2026-09-23 con el MCP de Figma. **Objetivo de este documento: no volver a pedir a Figma lo que ya sabemos.**
El plan Starter permite solo 20 llamadas de lectura por mes; se agotaron ese día.

Páginas: `0:1` Home (contiene todos los frames de pantallas) y `4:35` DS.
Todas las pantallas son de 1440 px de ancho: barra lateral 272 px + contenido 1149 px (con 30 px de margen interno).

## Tokens (get_variable_defs)

| Token | Valor |
|---|---|
| Primary-1 | `#ffb100` (botones, borde superior del footer) |
| Secondary-1 | `#0078cc` (títulos, "Legal") |
| Tertiary-1 | `#0e3a67` (footer) |
| Md Gray | `#bfbfbf` (menú, bordes, placeholders) |
| Dk Gray | `#494949` (texto) |
| Fondo de página | ≈ `#f2f2f2` (medido sobre `diseno/Principal1.jpg`) |
| Fuente | Cabin (Regular / SemiBold / Bold) |

## Componentes (medidas exactas)

- **Nav Bar** `119:997` (272×1071, blanco, py 30): logo `Casa-Logo2` 213×49 con pb 20; etiquetas de grupo 12 px gris (px 30, py 20); `Menu Button` = ícono Material 24 + texto 16 SemiBold gris, px 30, py 20, gap 10. Íconos: videocam (Contenidos), mic (Prensa), bookmark relleno (Libros), front_hand (Quiénes Somos), comment (Comuniquémonos). Abajo: logo ASSP 50×50 + "Con el respaldo de / Ahora Soy Papás de mi Papás" 12 px gris.
- **Topbar** `4:359` (1149×100, px 30): buscador 430×38, borde Md Gray, radio 20, placeholder "Buscar" 12 px, lupa 16. A la derecha "Iniciar sesión" y "Registrarse": círculo 38 con borde gris (radio 35) + texto 16 SemiBold negro, px 30 py 10, gap 10.
- **Footer** `115:501` (1169×297): franja superior `#0e3a67` con borde superior 5 px `#ffb100`, alto 205, p 50, tres columnas: "Contacto" 24 Bold blanco / email + WhatsApp (12 px, ícono 10) en 272 px / "Legal" (azul Secondary, Bold) + 3 enlaces en 272 px. Franja inferior: 4 íconos 16 (X, Facebook, Instagram, LinkedIn) en 245 px con justify-between + "® Todos los derechos reservados por Cuidar es 360 SAS" 16 px.
- **Botón**: fondo `#ffb100`, px 30 py 15, radio 10, texto 14 Bold blanco + flecha ↗ (16), gap 10.
- **Video Card**: 242 px de ancho (521 en Prensa del Home). Imagen 200 px de alto con esquinas superiores de 30; cuerpo blanco p 30, esquinas inferiores de 30, gap 15: título 16 Bold Dk Gray, descripción 16 Regular, botón.
- **Card de libro** (Home): blanca, radio 30, p 30, gap 30; imagen 178×212 + título "Libro 0N", descripción, botón "Conoce más". El libro 2 usa un recorte de la imagen (h 125.7 %, left −83 %, top −12.85 %, w 266 %).
- **Títulos de sección**: 24 Bold Secondary; título del hero 36 Bold Secondary; texto del hero 16 Bold Dk Gray, ancho 395.
- Líneas divisorias entre secciones del Home: `51:348`–`51:351` (ancho de contenido, en y = 565, 1156, 1682, 2096).

## Pantallas (frames dentro de `0:1`) — layout según metadata

| Pantalla | Nodo | Alto | Contenido |
|---|---|---|---|
| Home | `1:3` | 3417 | Hero `4:361` (texto 395 + imagen 634×405 con play y overlay negro 20 %); "Primera temporada" `36:104` (6 Video Cards 242, fila con scroll horizontal, gap 40); "Prensa" `42:108` (2 cards 521: TV, Radio); "Libros" `42:198` (2 cards 523); "Quiénes" `117:808` (imagen 634×405 + texto 395 + botón); "Comuniquémonos" `55:580` (1169×554, p 50: texto 497 + formulario 497); Footer |
| Contenidos | `60:958` | 1372 | Hero `60:973`: video 634×563 + barra "Patrocinio" 634×95 (`63:1271`); a la derecha "Video 01" (24), "Comprender" (36), texto, botón 175. "Próximo video" `63:1308` (imagen 251×147 + "Aprender" + botón 143). "Comparte" `66:1309`: 3 textareas 345×62 + botón 173. |
| Iniciar sesión | `75:1554` | 1216 | Título 24 centrado; columna 497: Usuario, Contraseña (inputs 48 alto), "Recuperar contraseña" a la derecha; botón 123 |
| Registrarse | `83:282` | 1234 | Título; columna 497, campos de 48 con gap 25: Nombre*, Apellido*, Email*, Teléfono*, Empresa, País de origen ▾, País de residencia ▾, ¿A quién ayudas, cuidas o has cuidado a distancia? ▾, ¿Hace cuántos años vives fuera de tu país? ▾; botón 153 |
| Quiénes Somos | `2016:847` | 2284 | Imagen hero 1088×440 (`2016:872`), párrafo `2016:877`, 7 Profile Cards 335×370 en 3 columnas (gap 40) |
| Prensa | `2016:880` | 2576 | Imagen hero `2016:895`; secciones "Entrevistas" (3 cards), "Notas de prensa" (4), "Podcast" (1), cards 242×416 |
| Libros | `2016:919` | 2576 | Imagen hero `2016:934`; zigzag: tarjeta blanca 509×419 + texto 529 + botón 170 (Libro 1 a la derecha, Libro 2 a la izquierda); abajo una imagen de captura 1168×534 (`2016:948`) con las tiendas |

## Assets ya descargados (no volver a pedirlos)

En `public/images/brand/`: `casa-logo.png`, `assp-logo.png`, `logo-x|facebook|instagram|linkedin|whatsapp.svg`.
En `public/images/figma/`: `hero-home.png` (hombre con teléfono), `video-card.png` (foto de cuidado), `libro-1.png`, `libro-2.png`.

## Lo que NO se pudo obtener (pendiente de cupo de Figma)

Imágenes: héroes de Quiénes Somos (`2016:872`), Prensa (`2016:895`), Libros (`2016:934`), imagen de "Quiénes" del Home (`117:813`), captura de tiendas de Libros (`2016:948`), imagen de video de Contenidos (`60:978`).
Diseño por nodo (colores de fondo, radios, tipografía): Comuniquémonos `55:580`, Profile Card, Iniciar sesión, Registrarse, Contenidos (`60:973`, `63:1308`, `66:1309`), Prensa y Libros.
Esas partes del sitio se construyeron con las medidas de arriba, sin el diseño del nodo.

Al usar el MCP: cargar primero `skill://figma/figma-design-to-code/SKILL.md` (recurso del servidor `figma`) y pasar `skillNames: "resource:figma-design-to-code"`.
