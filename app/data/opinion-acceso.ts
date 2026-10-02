// Textos del formulario de opinión de invitados y prensa (uno por video).
// ⚠️ SUPUESTO: el cliente aún no confirma el formulario definitivo; por ahora es "¿te gustó? sí/no" + mensaje.
// Para cambiar textos basta editar este archivo; si se agregan preguntas nuevas, sus respuestas viajan en
// `respuestas` (JSON) y se guardan en `opiniones_acceso.respuestas` sin tocar la base de datos.
export const OPINION_ACCESO = {
  titulo: 'Cuéntanos qué te pareció',
  preguntaMeGusto: '¿Te gustó este video?',
  etiquetaSi: 'Sí, me gustó',
  etiquetaNo: 'No me gustó',
  etiquetaMensaje: 'Déjanos un mensaje',
  placeholderMensaje: 'Escribe aquí tu opinión',
  boton: 'Enviar opinión',
  gracias: '¡Gracias! Tu opinión quedó registrada.',
  avisoFaltantes: (faltan: number) =>
    faltan === 1 ? 'Te falta 1 video por ver y opinar.' : `Te faltan ${faltan} videos por ver y opinar.`,
  completo: '¡Listo! Ya opinaste sobre los 4 videos. Gracias por tu ayuda.',
} as const

export const AVISO_REGISTRO_ACTIVIDAD =
  'Al entrar aceptas que registremos tu actividad (videos vistos, dispositivo, IP y ubicación aproximada) para mejorar la plataforma.'
