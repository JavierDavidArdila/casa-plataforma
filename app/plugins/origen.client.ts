// Guarda de dónde llegó la persona a la plataforma (referrer y utm de la primera página
// que abre en la sesión del navegador). Se envía al canjear un código de acceso.
export default defineNuxtPlugin(() => {
  try {
    if (sessionStorage.getItem('casa-origen')) return
    const q = new URLSearchParams(location.search)
    sessionStorage.setItem(
      'casa-origen',
      JSON.stringify({
        referrer: document.referrer || undefined,
        ruta: location.pathname + location.search,
        utm_source: q.get('utm_source') ?? undefined,
        utm_medium: q.get('utm_medium') ?? undefined,
        utm_campaign: q.get('utm_campaign') ?? undefined,
      })
    )
  } catch {
    // sin sessionStorage (modo privado): simplemente no se registra el origen
  }
})
