import { PREGUNTAS, obtenerFranja, PILARES, type Pilar } from '~/data/test-bienestar'

export interface ResultadoTest {
  puntajeIecd: number
  franja: ReturnType<typeof obtenerFranja>
  pilarPrincipal: Pilar | null
  puntajePorPilar: Record<Pilar, number>
}

export function useTestBienestar() {
  // respuestas[id] = valor único, o array de valores si es selección múltiple
  const respuestas = useState<Record<number, string | number | string[]>>('test-bienestar-respuestas', () => ({}))
  const pasoActual = useState('test-bienestar-paso', () => 0)
  const enviado = useState('test-bienestar-enviado', () => false)
  const enviando = useState('test-bienestar-enviando', () => false)
  const errorEnvio = useState<string | null>('test-bienestar-error', () => null)

  const totalPasos = PREGUNTAS.length
  const preguntaActual = computed(() => PREGUNTAS[pasoActual.value])
  const progreso = computed(() => Math.round(((pasoActual.value + 1) / totalPasos) * 100))
  const esUltimaPregunta = computed(() => pasoActual.value === totalPasos - 1)

  function responder(idPregunta: number, valor: string | number | string[]) {
    respuestas.value = { ...respuestas.value, [idPregunta]: valor }
  }

  function siguiente() {
    if (pasoActual.value < totalPasos - 1) pasoActual.value++
  }

  function anterior() {
    if (pasoActual.value > 0) pasoActual.value--
  }

  function calcularResultado(): ResultadoTest {
    let puntajeIecd = 0
    const puntajePorPilar: Record<Pilar, number> = { COMPRENDER: 0, ACOMPANAR: 0, SOSTENER: 0, ALIVIAR: 0 }

    for (const pregunta of PREGUNTAS) {
      if (!pregunta.puntua) continue
      const valor = respuestas.value[pregunta.id]
      const puntos = typeof valor === 'number' ? valor : Number(valor) || 0
      puntajeIecd += puntos
      if (pregunta.pilar) puntajePorPilar[pregunta.pilar] += puntos
    }

    const pilaresConPuntaje = Object.entries(puntajePorPilar) as [Pilar, number][]
    const pilarPrincipal =
      pilaresConPuntaje.length > 0
        ? pilaresConPuntaje.reduce((max, actual) => (actual[1] > max[1] ? actual : max))[0]
        : null

    return {
      puntajeIecd,
      franja: obtenerFranja(puntajeIecd),
      pilarPrincipal,
      puntajePorPilar,
    }
  }

  async function enviarResultado() {
    enviando.value = true
    errorEnvio.value = null
    const resultado = calcularResultado()

    try {
      await $fetch('/api/test-bienestar', {
        method: 'POST',
        body: {
          respuestas: respuestas.value,
          puntajeIecd: resultado.puntajeIecd,
          resultado: resultado.franja.resultado,
          pilarPrincipal: resultado.pilarPrincipal,
        },
      })
      enviado.value = true
    } catch (e) {
      // No bloqueamos al usuario si falla el guardado: igual ve su resultado.
      errorEnvio.value = 'No pudimos guardar tu resultado, pero aquí lo tienes igual.'
      enviado.value = true
      console.error('Error guardando resultado del test:', e)
    } finally {
      enviando.value = false
    }
  }

  function reiniciar() {
    respuestas.value = {}
    pasoActual.value = 0
    enviado.value = false
    errorEnvio.value = null
  }

  return {
    respuestas,
    pasoActual,
    preguntaActual,
    progreso,
    totalPasos,
    esUltimaPregunta,
    enviado,
    enviando,
    errorEnvio,
    responder,
    siguiente,
    anterior,
    calcularResultado,
    enviarResultado,
    reiniciar,
    PILARES,
  }
}
