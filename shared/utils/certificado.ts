// Textos del certificado de cada contenido (PDF "Certificado CASA" del cliente, 5 oct 2026).
// Se usan en la página /certificado/<slug> y en el correo de felicitación.
export const CERTIFICADOS: Record<string, { pilar: string; logro: string; correo: string[]; siguiente: string }> = {
  comprender: { pilar: 'COMPRENDER', logro: 'Ahora entiendes mejor tu realidad y tus límites.',
    // Texto del correo de felicitación (autorresponder del cliente, 6 oct 2026).
    correo: [
      'Has completado el primer contenido de la Primera Temporada: COMPRENDER.',
      'Ya has entendido el manejo de los límites, los propios y los de los demás, para llegar a acuerdos y armonía sobre cuidar a distancia.',
      'Pon en práctica el ejercicio que descargaste en PDF meditando y escribiendo, idealmente a mano, tus pensamientos.',
    ],
    siguiente: 'En pocos días te daremos noticias sobre el segundo pilar: APRENDER.',
  },
}
