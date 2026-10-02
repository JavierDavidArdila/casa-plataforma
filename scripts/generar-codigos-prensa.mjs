// Genera códigos de acceso de prensa (uno por tarjeta).
//   node scripts/generar-codigos-prensa.mjs <cantidad> [dias_acceso=90] [max_ingresos=5] [medio1,medio2,...]
// Imprime el SQL de inserción en scripts/salida/codigos-prensa.sql y el CSV para
// imprimir en scripts/salida/codigos-prensa.csv (carpeta git-ignored).
// Aplicar en producción (usar --command, no --file):
//   npx wrangler d1 execute casa-test-bienestar-db --remote --command "$(cat scripts/salida/codigos-prensa.sql)"
import { mkdirSync, writeFileSync } from 'node:fs'
import { randomInt } from 'node:crypto'

const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const [cantidadArg, diasArg = '90', maxArg = '5', medios = ''] = process.argv.slice(2)
const cantidad = Number(cantidadArg)
const dias = Number(diasArg)
const maxUsos = Number(maxArg)
if (!Number.isInteger(cantidad) || cantidad < 1 || !Number.isInteger(dias) || dias < 1 || !Number.isInteger(maxUsos) || maxUsos < 1) {
  console.error('Uso: node scripts/generar-codigos-prensa.mjs <cantidad> [dias_acceso=90] [max_ingresos=5] [medio1,medio2,...]')
  process.exit(1)
}
const nombres = medios ? medios.split(',').map((m) => m.trim()) : []

function codigo() {
  const c = Array.from({ length: 12 }, () => ALFABETO[randomInt(ALFABETO.length)]).join('')
  return `${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`
}

const usados = new Set()
const filas = []
for (let i = 0; i < cantidad; i++) {
  let c
  do c = codigo()
  while (usados.has(c))
  usados.add(c)
  filas.push({ codigo: c, medio: nombres[i] ?? `Prensa ${i + 1}` })
}

const esc = (s) => s.replace(/'/g, "''")
const sql = filas.map((f) => `INSERT INTO codigos_prensa (codigo, medio, dias_acceso, max_usos) VALUES ('${f.codigo}', '${esc(f.medio)}', ${dias}, ${maxUsos});`).join('\n')
const csv = ['codigo,medio', ...filas.map((f) => `${f.codigo},"${f.medio.replace(/"/g, '""')}"`)].join('\n')

mkdirSync('scripts/salida', { recursive: true })
writeFileSync('scripts/salida/codigos-prensa.sql', sql + '\n')
writeFileSync('scripts/salida/codigos-prensa.csv', csv + '\n')
console.log(`${cantidad} códigos generados (acceso de ${dias} días desde el primer uso) en scripts/salida/ (máx. ${maxUsos} ingresos por código)`)
