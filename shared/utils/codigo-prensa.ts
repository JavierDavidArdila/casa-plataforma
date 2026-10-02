// Código de acceso de prensa: 12 caracteres en 3 bloques de 4 (K7M4-9QXD-2HPW).
// Alfabeto sin caracteres ambiguos (sin 0/O, 1/I/L) para que se pueda teclear desde la tarjeta.
export const ALFABETO_CODIGO_PRENSA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
export const LARGO_CODIGO_PRENSA = 12

// Acepta minúsculas, espacios y guiones de más; devuelve el código normalizado sin guiones.
export function normalizarCodigoPrensa(texto: string): string {
  return texto.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function formatearCodigoPrensa(normalizado: string): string {
  return normalizado.replace(/(.{4})(?=.)/g, '$1-')
}

export function pareceCodigoPrensa(texto: string): boolean {
  const n = normalizarCodigoPrensa(texto)
  return n.length === LARGO_CODIGO_PRENSA && [...n].every((c) => ALFABETO_CODIGO_PRENSA.includes(c))
}
