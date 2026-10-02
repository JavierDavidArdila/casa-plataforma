// Código de acceso (prensa o invitado): 12 caracteres en 3 bloques de 4 (K7M4-9QXD-2HPW).
// Alfabeto sin caracteres ambiguos (sin 0/O, 1/I/L) para que se pueda teclear desde la tarjeta.
export const ALFABETO_CODIGO_ACCESO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
export const LARGO_CODIGO_ACCESO = 12

// Acepta minúsculas, espacios y guiones de más; devuelve el código normalizado sin guiones.
export function normalizarCodigoAcceso(texto: string): string {
  return texto.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function formatearCodigoAcceso(normalizado: string): string {
  return normalizado.replace(/(.{4})(?=.)/g, '$1-')
}

export function pareceCodigoAcceso(texto: string): boolean {
  const n = normalizarCodigoAcceso(texto)
  return n.length === LARGO_CODIGO_ACCESO && [...n].every((c) => ALFABETO_CODIGO_ACCESO.includes(c))
}
