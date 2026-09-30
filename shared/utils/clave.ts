// Reglas mínimas de la clave (pedidas por el cliente): 8 caracteres, con
// mayúscula, minúscula, número y un carácter especial (por ejemplo $ # +).
// Se usa igual en el navegador (crear-cuenta) y en el servidor (/api/cuenta).
export const REGLAS_CLAVE = [
  { id: 'largo', texto: 'Al menos 8 caracteres', cumple: (c: string) => c.length >= 8 },
  { id: 'mayuscula', texto: 'Una letra mayúscula', cumple: (c: string) => /\p{Lu}/u.test(c) },
  { id: 'minuscula', texto: 'Una letra minúscula', cumple: (c: string) => /\p{Ll}/u.test(c) },
  { id: 'numero', texto: 'Un número', cumple: (c: string) => /\d/.test(c) },
  { id: 'especial', texto: 'Un carácter especial (por ejemplo $ # + !)', cumple: (c: string) => /[^\p{L}\d\s]/u.test(c) },
]

export function claveValida(clave: string): boolean {
  return REGLAS_CLAVE.every((regla) => regla.cumple(clave))
}
