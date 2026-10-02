// Genera códigos de acceso (uno por tarjeta) para invitados o prensa.
//   node scripts/generar-codigos-acceso.mjs <prensa|invitado> <cantidad> [dias_acceso=30] [max_ingresos=5] [nombre1,nombre2,...]
// Escribe el SQL de inserción en scripts/salida/codigos-<tipo>.sql y el CSV para imprimir en
// scripts/salida/codigos-<tipo>.csv (carpeta git-ignored). Aplicar en producción (usar --command, no --file):
//   npx wrangler d1 execute casa-test-bienestar-db --remote --command "$(cat scripts/salida/codigos-prensa.sql)"
import { mkdirSync, writeFileSync } from 'node:fs'
import { randomInt } from 'node:crypto'

const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const USO = 'Uso: node scripts/generar-codigos-acceso.mjs <prensa|invitado> <cantidad> [dias_acceso=30] [max_ingresos=5] [nombre1,nombre2,...]'
const [tipo, cantidadArg, diasArg = '30', maxArg = '5', nombresArg = ''] = process.argv.slice(2)
const cantidad = Number(cantidadArg)
const dias = Number(diasArg)
const maxUsos = Number(maxArg)
const entero = (n) => Number.isInteger(n) && n >= 1
if (!['prensa', 'invitado'].includes(tipo) || !entero(cantidad) || !entero(dias) || !entero(maxUsos)) {
  console.error(USO)
  process.exit(1)
}
const nombres = nombresArg ? nombresArg.split(',').map((m) => m.trim()) : []
const etiqueta = tipo === 'prensa' ? 'Prensa' : 'Invitado'

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
  filas.push({ codigo: c, medio: nombres[i] ?? `${etiqueta} ${i + 1}` })
}

const esc = (s) => s.replace(/'/g, "''")
const sql = filas
  .map((f) => `INSERT INTO codigos_acceso (codigo, medio, tipo, dias_acceso, max_usos) VALUES ('${f.codigo}', '${esc(f.medio)}', '${tipo}', ${dias}, ${maxUsos});`)
  .join('\n')
const csv = ['codigo,tipo,nombre', ...filas.map((f) => `${f.codigo},${tipo},"${f.medio.replace(/"/g, '""')}"`)].join('\n')

mkdirSync('scripts/salida', { recursive: true })
writeFileSync(`scripts/salida/codigos-${tipo}.sql`, sql + '\n')
writeFileSync(`scripts/salida/codigos-${tipo}.csv`, csv + '\n')
console.log(`${cantidad} códigos de ${tipo} (${dias} días desde el primer uso, máx. ${maxUsos} ingresos) en scripts/salida/codigos-${tipo}.*`)
