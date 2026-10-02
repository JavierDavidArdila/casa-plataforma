// El dominio canónico es https://casacuidadoadistancia.co. El host `*.workers.dev` sigue activo
// para pruebas, pero no debe indexarse: se marca con X-Robots-Tag (y no se bloquea en robots.txt,
// para que los buscadores puedan ver el noindex).
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true }).split(':')[0] ?? ''
  if (host.endsWith('.workers.dev')) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
