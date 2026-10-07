// Embudo anónimo de visitas (ver server/api/embudo.post.ts). Nunca rompe la página.
type EventoEmbudo = 'pagina' | 'video_bienvenida' | 'registro_enviado' | 'registro_ok' | 'registro_error' | 'test_inicio' | 'test_fin' | 'cuenta_ok'

function idVisitante() {
  try {
    let id = localStorage.getItem('casa-visitante')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('casa-visitante', id)
    }
    return id
  } catch {
    return (globalThis as { __casaVisitante?: string }).__casaVisitante ??= crypto.randomUUID()
  }
}

// Origen de la primera página de la sesión (lo guarda plugins/origen.client.ts): utm_source o el dominio del referrer.
function origen() {
  try {
    const o = JSON.parse(sessionStorage.getItem('casa-origen') ?? '{}')
    if (o.utm_source) return [o.utm_source, o.utm_medium, o.utm_campaign].filter(Boolean).join('/')
    if (o.referrer) return new URL(o.referrer).hostname
  } catch {
    // sin sessionStorage o referrer inválido
  }
  return 'directo'
}

export function useEmbudo() {
  function registrar(evento: EventoEmbudo) {
    if (!import.meta.client) return
    try {
      const cuerpo = JSON.stringify({ visitante: idVisitante(), evento, ruta: location.pathname, origen: origen() })
      if (!navigator.sendBeacon?.('/api/embudo', new Blob([cuerpo], { type: 'application/json' }))) {
        void fetch('/api/embudo', { method: 'POST', body: cuerpo, headers: { 'content-type': 'application/json' }, keepalive: true })
      }
    } catch {
      // el seguimiento nunca debe romper la página
    }
  }
  return { registrar }
}
