// Modelo de datos del "Test de Bienestar C.A.S.A." (antes Autodiagnóstico).
// Fuente: documento "Esquema y preguntas Test Bienestar CASA.docx" (correo del
// 3 de sep. de 2026, David Ángel — asunto "Avances para desarrollo y diseño C.A.S.A.").
//
// ⚠️ SUPUESTO A CONFIRMAR CON EL EQUIPO (Oscar/Alejandra/David Ángel):
// El documento no da explícitamente el mapeo pregunta → pilar C.A.S.A. para
// todas las preguntas que puntúan, solo describe cada pilar en texto libre
// (sección 5). El mapeo de abajo (campo `pilar`) es una propuesta razonable
// basada en esas descripciones, no una definición oficial del cliente.
// Antes de publicar el resultado con "tu área de atención es X", confirmarlo.

export type Pilar = 'COMPRENDER' | 'ACOMPANAR' | 'SOSTENER' | 'ALIVIAR'

export const PILARES: Record<Pilar, { nombre: string; descripcion: string }> = {
  COMPRENDER: {
    nombre: 'Comprender',
    descripcion: 'Culpa, sensación de insuficiencia, aceptación del nuevo rol.',
  },
  ACOMPANAR: {
    nombre: 'Acompañar',
    descripcion: 'Comunicación, tensión emocional, calidad del vínculo.',
  },
  SOSTENER: {
    nombre: 'Sostener',
    descripcion: 'Dependencia excesiva, red familiar, organización y distribución de responsabilidades.',
  },
  ALIVIAR: {
    nombre: 'Aliviar',
    descripcion: 'Sobrecarga general, equilibrio entre cuidado y vida propia, recuperación de tranquilidad.',
  },
}

export type TipoPregunta = 'seleccion-unica' | 'seleccion-multiple' | 'escala-0-4'

export interface OpcionPregunta {
  /** Valor guardado (texto para no-puntuables, número 0-4 para puntuables) */
  valor: string | number
  etiqueta: string
}

export interface PreguntaTest {
  id: number
  texto: string
  tipo: TipoPregunta
  opciones: OpcionPregunta[]
  /** ¿Esta pregunta suma al IECD? */
  puntua: boolean
  /** Solo si puntua = true */
  pilar?: Pilar
}

// Escala estándar usada en la mayoría de preguntas 5-15
const ESCALA_0_4: OpcionPregunta[] = [
  { valor: 0, etiqueta: 'Nunca' },
  { valor: 1, etiqueta: 'Rara vez' },
  { valor: 2, etiqueta: 'Algunas veces' },
  { valor: 3, etiqueta: 'Bastantes veces' },
  { valor: 4, etiqueta: 'Casi siempre' },
]

export const PREGUNTAS: PreguntaTest[] = [
  {
    id: 1,
    texto: '¿Hace cuánto cuidas a distancia?',
    tipo: 'seleccion-unica',
    puntua: false,
    opciones: [
      { valor: '0-3', etiqueta: '0 a 3 años' },
      { valor: '4-6', etiqueta: '4 a 6 años' },
      { valor: '7-10', etiqueta: '7 a 10 años' },
      { valor: '10-13', etiqueta: '10 a 13 años' },
      { valor: '14-17', etiqueta: '14 a 17 años' },
      { valor: '18-21', etiqueta: '18 a 21 años' },
      { valor: '22+', etiqueta: '22 años o más' },
    ],
  },
  {
    id: 2,
    texto: '¿Cuál es tu mayor aporte para quien cuidas a distancia?',
    tipo: 'seleccion-unica',
    puntua: false,
    opciones: [
      { valor: 'apoyo-logistico', etiqueta: 'Apoyo logístico' },
      { valor: 'ayuda-economica', etiqueta: 'Ayuda económica' },
      { valor: 'acompanamiento', etiqueta: 'Acompañamiento' },
      { valor: 'dialogo-profundo', etiqueta: 'Diálogo profundo' },
      { valor: 'apoyo-emocional', etiqueta: 'Apoyo emocional' },
    ],
  },
  {
    id: 3,
    texto: '¿Quién es tu principal interlocutor cuando cuidas a distancia?',
    tipo: 'seleccion-multiple',
    // No puntúa; el documento la marca como variable de contexto sobre la red de apoyo.
    puntua: false,
    opciones: [
      { valor: 'papa', etiqueta: 'Papá' },
      { valor: 'mama', etiqueta: 'Mamá' },
      { valor: 'abuelo', etiqueta: 'Abuelo' },
      { valor: 'abuela', etiqueta: 'Abuela' },
      { valor: 'hermanos', etiqueta: 'Hermanos' },
      { valor: 'primos', etiqueta: 'Primos' },
      { valor: 'otros-familiares', etiqueta: 'Otros familiares' },
      { valor: 'enfermera', etiqueta: 'Enfermera' },
      { valor: 'cuidador', etiqueta: 'Cuidador' },
      { valor: 'personas-servicio', etiqueta: 'Personas de servicio' },
      { valor: 'amigos-cercanos', etiqueta: 'Amigos cercanos' },
      { valor: 'vecinos', etiqueta: 'Vecinos' },
    ],
  },
  {
    id: 4,
    texto: 'Mi comunicación con esta(s) persona(s) es:',
    tipo: 'seleccion-unica',
    puntua: true,
    pilar: 'ACOMPANAR',
    // El documento no da el valor numérico de estas opciones; se propone una
    // escala 0-4 de mejor a peor comunicación, consistente con el resto del test.
    opciones: [
      { valor: 0, etiqueta: 'Fluida' },
      { valor: 1, etiqueta: 'Funcional' },
      { valor: 2, etiqueta: 'Deficiente' },
      { valor: 3, etiqueta: 'Mala' },
      { valor: 4, etiqueta: 'Inexistente' },
    ],
  },
  {
    id: 5,
    texto:
      '¿Te sientes estresado(a) entre apoyar y cuidar a tu familiar a la distancia y tratar de cumplir con tus otras responsabilidades (trabajo, pareja, hijos, otras)?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ALIVIAR',
    opciones: ESCALA_0_4,
  },
  {
    id: 6,
    texto:
      '¿Sientes que el familiar al que apoyas y cuidas a distancia afecta negativamente tu relación con otros miembros de la familia o amigos?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'SOSTENER',
    opciones: ESCALA_0_4,
  },
  {
    id: 7,
    texto: '¿Sientes que tu familiar al que apoyas y cuidas a distancia depende demasiado de ti?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'SOSTENER',
    opciones: ESCALA_0_4,
  },
  {
    id: 8,
    texto:
      '¿Te sientes tenso(a) cuando estás en contacto (llamada de audio, video, chat) con tu familiar que apoyas y cuidas a distancia?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ACOMPANAR',
    opciones: ESCALA_0_4,
  },
  {
    id: 9,
    texto: '¿Sientes que tu familiar espera que tú le apoyes como si fueras la única persona de la que depende?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'SOSTENER',
    opciones: ESCALA_0_4,
  },
  {
    id: 10,
    texto: '¿Sientes que tu relación con tu familiar que apoyas y cuidas a distancia se basa más en...?',
    tipo: 'seleccion-unica',
    puntua: false,
    opciones: [
      { valor: 1, etiqueta: 'Apoyo económico' },
      { valor: 2, etiqueta: 'Conservar la armonía' },
      { valor: 3, etiqueta: 'Respeto y gratitud' },
      { valor: 4, etiqueta: 'Fortalecer los lazos familiares' },
    ],
  },
  {
    id: 11,
    texto: '¿Sientes que deberías hacer más por su familiar?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'COMPRENDER',
    opciones: ESCALA_0_4,
  },
  {
    id: 12,
    texto: 'En general, ¿te sientes muy sobrecargado(a) por tener que apoyar o cuidar a la distancia a tu familiar?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ALIVIAR',
    opciones: ESCALA_0_4,
  },
  {
    id: 13,
    texto:
      '¿Te sientes intranquilo(a) o preocupado(a) por lo que pueda ocurrir cuando no puedes comunicarte o intervenir desde la distancia?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ALIVIAR',
    opciones: ESCALA_0_4,
  },
  {
    id: 14,
    texto:
      '¿El apoyo o cuidado a distancia interfiere con tu tiempo personal, tu descanso o tu capacidad para desconectarte de las responsabilidades del cuidado?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ALIVIAR',
    opciones: ESCALA_0_4,
  },
  {
    id: 15,
    texto:
      '¿El apoyo económico que brindas a tu familiar afecta tu tranquilidad financiera o limita otros gastos importantes para ti o tu familia?',
    tipo: 'escala-0-4',
    puntua: true,
    pilar: 'ALIVIAR',
    opciones: ESCALA_0_4,
  },
]

// --- Índice de Esfuerzo del Cuidador a Distancia (IECD) ---

export interface FranjaResultado {
  min: number
  max: number
  resultado: string
  interpretacion: string
}

export const FRANJAS_IECD: FranjaResultado[] = [
  { min: 0, max: 10, resultado: 'Estoy en equilibrio', interpretacion: 'Bajo esfuerzo percibido' },
  { min: 11, max: 21, resultado: 'Necesito organizar mejor mi cuidado', interpretacion: 'Esfuerzo leve/moderado' },
  { min: 22, max: 32, resultado: 'Me siento sobrecargado', interpretacion: 'Esfuerzo elevado' },
  { min: 33, max: 44, resultado: 'Necesito apoyo', interpretacion: 'Esfuerzo muy elevado' },
]

export function obtenerFranja(puntaje: number): FranjaResultado {
  return FRANJAS_IECD.find((f) => puntaje >= f.min && puntaje <= f.max) ?? FRANJAS_IECD[FRANJAS_IECD.length - 1]
}
