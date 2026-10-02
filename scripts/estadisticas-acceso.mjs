// Estadísticas de los accesos de invitado y prensa, leídas de la base D1.
//   node scripts/estadisticas-acceso.mjs [--local]      (por defecto: producción, --remote)
// Imprime un resumen por código y escribe scripts/salida/estadisticas-acceso.csv (por código) y
// scripts/salida/opiniones-acceso.csv (cada opinión con su mensaje).
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const destino = process.argv.includes('--local') ? '--local' : '--remote'

function consultar(sql) {
  const salida = execFileSync('npx', ['wrangler', 'd1', 'execute', 'casa-test-bienestar-db', destino, '--json', '--command', sql], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  return JSON.parse(salida.slice(salida.indexOf('[')))[0].results
}

const csv = (filas) => {
  if (!filas.length) return ''
  const cols = Object.keys(filas[0])
  const celda = (v) => (v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`)
  return [cols.join(','), ...filas.map((f) => cols.map((c) => celda(f[c])).join(','))].join('\n') + '\n'
}

const porCodigo = consultar(`
SELECT c.codigo, c.tipo, c.medio AS nombre, c.activo, c.usos AS ingresos, c.max_usos, c.canjeado_en, c.vence_en,
  CAST(MAX(0, julianday(c.vence_en) - julianday('now')) AS INTEGER) AS dias_restantes,
  (SELECT COUNT(DISTINCT ip) FROM accesos_log a WHERE a.codigo_id = c.id) AS ips_distintas,
  (SELECT GROUP_CONCAT(DISTINCT COALESCE(pais, '?') || '/' || COALESCE(ciudad, '?')) FROM accesos_log a WHERE a.codigo_id = c.id) AS ubicaciones,
  (SELECT COUNT(DISTINCT video) FROM eventos_uso e WHERE e.codigo_id = c.id AND e.evento IN ('video_inicio','video_progreso','video_fin')) AS videos_vistos,
  (SELECT COUNT(*) FROM eventos_uso e WHERE e.codigo_id = c.id AND e.evento = 'pagina') AS paginas_vistas,
  (SELECT COUNT(*) FROM opiniones_acceso o WHERE o.codigo_id = c.id) AS opiniones,
  (SELECT SUM(me_gusto) FROM opiniones_acceso o WHERE o.codigo_id = c.id) AS me_gusto_si
FROM codigos_acceso c ORDER BY c.tipo, c.id`)

const avance = consultar(`
SELECT c.codigo, e.video, ROUND(MAX(e.porcentaje), 1) AS max_porcentaje,
  SUM(CASE WHEN e.evento = 'video_fin' THEN 1 ELSE 0 END) AS completado
FROM eventos_uso e JOIN codigos_acceso c ON c.id = e.codigo_id
WHERE e.video IS NOT NULL AND e.evento <> 'opinion' GROUP BY c.codigo, e.video ORDER BY c.codigo, e.video`)

const opiniones = consultar(`
SELECT c.codigo, o.tipo, c.medio AS nombre, o.video, CASE o.me_gusto WHEN 1 THEN 'sí' ELSE 'no' END AS me_gusto, o.mensaje, o.creado_en
FROM opiniones_acceso o JOIN codigos_acceso c ON c.id = o.codigo_id ORDER BY c.codigo, o.video`)

console.log(`\n== Accesos (${destino.slice(2)}) ==`)
console.table(porCodigo.map(({ codigo, tipo, nombre, ingresos, max_usos, dias_restantes, ips_distintas, videos_vistos, opiniones: n, me_gusto_si }) =>
  ({ codigo, tipo, nombre, ingresos: `${ingresos}/${max_usos}`, dias_restantes, ips_distintas, videos_vistos, opiniones: n, me_gusto_si })))
if (avance.length) {
  console.log('== Avance por video (máx. % alcanzado) ==')
  console.table(avance)
}
mkdirSync('scripts/salida', { recursive: true })
writeFileSync('scripts/salida/estadisticas-acceso.csv', csv(porCodigo))
writeFileSync('scripts/salida/opiniones-acceso.csv', csv(opiniones))
console.log('CSV: scripts/salida/estadisticas-acceso.csv y scripts/salida/opiniones-acceso.csv')
