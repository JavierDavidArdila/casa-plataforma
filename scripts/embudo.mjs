// Reporte del embudo anónimo de visitas (tabla `embudo`, ver migrations/0009_embudo.sql).
//   node scripts/embudo.mjs [--local] [--desde=2026-10-06] [--hasta=2026-10-07]   (por defecto: producción, últimas 24 h)
// Las fechas se interpretan en hora de Colombia (UTC-5). Visitantes = navegadores distintos.
import { execFileSync } from 'node:child_process'

const destino = process.argv.includes('--local') ? '--local' : '--remote'
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1]
const desde = arg('desde') ? `datetime('${arg('desde')}', '+5 hours')` : "datetime('now', '-1 day')"
const hasta = arg('hasta') ? `datetime('${arg('hasta')}', '+5 hours')` : "datetime('now')"
const rango = `creado_en >= ${desde} AND creado_en < ${hasta}`

function consultar(sql) {
  const salida = execFileSync('npx', ['wrangler', 'd1', 'execute', 'casa-test-bienestar-db', destino, '--json', '--command', sql], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  return JSON.parse(salida.slice(salida.indexOf('[')))[0].results
}

const visitantes = (where) => `(SELECT COUNT(DISTINCT visitante) FROM embudo WHERE ${rango} AND ${where})`
const [pasos] = consultar(`SELECT
  ${visitantes("evento = 'pagina'")} AS visitantes,
  ${visitantes("evento = 'pagina' AND ruta = '/'")} AS vieron_home,
  ${visitantes("evento = 'video_bienvenida'")} AS video_bienvenida,
  ${visitantes("evento = 'pagina' AND ruta = '/registrarse'")} AS abrieron_registro,
  ${visitantes("evento = 'registro_enviado'")} AS enviaron_registro,
  ${visitantes("evento = 'registro_ok'")} AS registro_ok,
  ${visitantes("evento = 'registro_error'")} AS registro_error,
  ${visitantes("evento = 'test_inicio'")} AS empezaron_test,
  ${visitantes("evento = 'test_fin'")} AS terminaron_test,
  ${visitantes("evento = 'cuenta_ok'")} AS crearon_cuenta`)

console.log('\nEmbudo (visitantes distintos)')
for (const [paso, n] of Object.entries(pasos)) console.log(`  ${paso.padEnd(20)} ${n}`)

const tabla = (titulo, sql) => {
  console.log(`\n${titulo}`)
  console.table(consultar(sql))
}
tabla('Páginas más vistas', `SELECT ruta, COUNT(*) AS vistas, COUNT(DISTINCT visitante) AS visitantes FROM embudo
  WHERE ${rango} AND evento = 'pagina' GROUP BY ruta ORDER BY visitantes DESC LIMIT 15`)
tabla('Origen', `SELECT origen, COUNT(DISTINCT visitante) AS visitantes FROM embudo WHERE ${rango} GROUP BY origen ORDER BY visitantes DESC LIMIT 15`)
tabla('País y dispositivo', `SELECT pais, dispositivo, COUNT(DISTINCT visitante) AS visitantes FROM embudo WHERE ${rango}
  GROUP BY pais, dispositivo ORDER BY visitantes DESC LIMIT 15`)
tabla('Por hora (Colombia)', `SELECT strftime('%Y-%m-%d %H:00', creado_en, '-5 hours') AS hora, COUNT(DISTINCT visitante) AS visitantes
  FROM embudo WHERE ${rango} GROUP BY hora ORDER BY hora`)
