// Seguimiento de uso de invitados/prensa. El servidor ignora (204) las sesiones que no son de ese tipo,
// así que es seguro llamarlo siempre. Usa sendBeacon para que el último evento no se pierda al cerrar la pestaña.
export function useSeguimiento() {
  function enviar(datos: { evento: string; ruta?: string; video?: string; posicion?: number; duracion?: number }) {
    if (!import.meta.client) return
    const cuerpo = JSON.stringify({ ruta: location.pathname, ...datos })
    try {
      const blob = new Blob([cuerpo], { type: 'application/json' })
      if (!navigator.sendBeacon?.('/api/evento', blob)) {
        void fetch('/api/evento', { method: 'POST', body: cuerpo, headers: { 'content-type': 'application/json' }, keepalive: true })
      }
    } catch {
      // el seguimiento nunca debe romper la página
    }
  }

  function paginaVista() {
    enviar({ evento: 'pagina' })
  }

  // Engancha un <video> real: inicio, progreso cada 10 s, y fin. También envía la posición al ocultar la pestaña.
  function seguirVideo(el: HTMLVideoElement, slug: string) {
    let ultimoEnvio = 0
    const posicion = () => ({ video: slug, posicion: el.currentTime, duracion: el.duration || undefined })
    el.addEventListener('play', () => {
      if (!ultimoEnvio) enviar({ evento: 'video_inicio', ...posicion() })
      ultimoEnvio = ultimoEnvio || Date.now()
    })
    el.addEventListener('timeupdate', () => {
      if (Date.now() - ultimoEnvio >= 10_000 && ultimoEnvio) {
        ultimoEnvio = Date.now()
        enviar({ evento: 'video_progreso', ...posicion() })
      }
    })
    el.addEventListener('ended', () => enviar({ evento: 'video_fin', ...posicion() }))
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && ultimoEnvio) enviar({ evento: 'video_progreso', ...posicion() })
    })
  }

  return { enviar, paginaVista, seguirVideo }
}
