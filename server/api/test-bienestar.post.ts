// Endpoint del mismo Worker del sitio (gracias al preset 'cloudflare_module').
// Recalcula el puntaje en servidor (no confía en el valor que mande el cliente)
// y lo guarda en la base D1 `casa-test-bienestar-db`.

interface CloudflareEnv {
  DB: D1Database
}

const PREGUNTAS_QUE_PUNTUAN: Record<number, 'COMPRENDER' | 'ACOMPANAR' | 'SOSTENER' | 'ALIVIAR'> = {
  4: 'ACOMPANAR',
  5: 'ALIVIAR',
  6: 'SOSTENER',
  7: 'SOSTENER',
  8: 'ACOMPANAR',
  9: 'SOSTENER',
  11: 'COMPRENDER',
  12: 'ALIVIAR',
  13: 'ALIVIAR',
  14: 'ALIVIAR',
  15: 'ALIVIAR',
}

function calcularPuntaje(respuestas: Record<string, unknown>) {
  let puntajeIecd = 0
  const puntajePorPilar: Record<string, number> = { COMPRENDER: 0, ACOMPANAR: 0, SOSTENER: 0, ALIVIAR: 0 }

  for (const [idStr, pilar] of Object.entries(PREGUNTAS_QUE_PUNTUAN)) {
    const valor = Number(respuestas[idStr])
    const puntos = Number.isFinite(valor) ? Math.min(Math.max(valor, 0), 4) : 0
    puntajeIecd += puntos
    puntajePorPilar[pilar] += puntos
  }

  const pilarPrincipal = Object.entries(puntajePorPilar).reduce((max, actual) =>
    actual[1] > max[1] ? actual : max
  )[0]

  let resultado = 'Necesito apoyo'
  if (puntajeIecd <= 10) resultado = 'Estoy en equilibrio'
  else if (puntajeIecd <= 21) resultado = 'Necesito organizar mejor mi cuidado'
  else if (puntajeIecd <= 32) resultado = 'Me siento sobrecargado'

  return { puntajeIecd, resultado, pilarPrincipal }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ respuestas?: Record<string, unknown> }>(event)
  const respuestas = body?.respuestas ?? {}

  const { puntajeIecd, resultado, pilarPrincipal } = calcularPuntaje(respuestas)

  const env = event.context.cloudflare?.env as CloudflareEnv | undefined
  if (!env?.DB) {
    // En dev local sin `wrangler dev` / binding emulado, no hay DB disponible.
    // No tumbamos la respuesta al usuario por esto.
    console.warn('Binding DB no disponible: la respuesta no se guardó.')
    return { ok: true, guardado: false, puntajeIecd, resultado, pilarPrincipal }
  }

  await env.DB.prepare(
    `INSERT INTO respuestas_test
      (anios_cuidando, mayor_aporte, interlocutores, comunicacion,
       p5, p6, p7, p8, p9, naturaleza_relacion, p11, p12, p13, p14, p15,
       puntaje_iecd, resultado, pilar_principal)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      String(respuestas['1'] ?? ''),
      String(respuestas['2'] ?? ''),
      JSON.stringify(respuestas['3'] ?? []),
      String(respuestas['4'] ?? ''),
      Number(respuestas['5']) || 0,
      Number(respuestas['6']) || 0,
      Number(respuestas['7']) || 0,
      Number(respuestas['8']) || 0,
      Number(respuestas['9']) || 0,
      String(respuestas['10'] ?? ''),
      Number(respuestas['11']) || 0,
      Number(respuestas['12']) || 0,
      Number(respuestas['13']) || 0,
      Number(respuestas['14']) || 0,
      Number(respuestas['15']) || 0,
      puntajeIecd,
      resultado,
      pilarPrincipal
    )
    .run()

  return { ok: true, guardado: true, puntajeIecd, resultado, pilarPrincipal }
})
