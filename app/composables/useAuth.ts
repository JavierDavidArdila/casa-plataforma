export interface EstadoSesion {
  autenticado: boolean
  suscrito?: boolean
  codigoUsuario?: string | null
  nombre?: string
  apellido?: string
  tieneCuenta?: boolean
  tipoAcceso?: 'prensa' | 'invitado' | null
  venceEn?: string | null
  opinionesEnviadas?: string[]
  referidosEnviados?: boolean
}

export function useAuth() {
  const sesion = useState<EstadoSesion>('sesion-casa', () => ({ autenticado: false }))
  const cargando = useState('sesion-casa-cargando', () => false)

  async function cargarSesion() {
    cargando.value = true
    try {
      sesion.value = await $fetch<EstadoSesion>('/api/me')
    } catch {
      sesion.value = { autenticado: false }
    } finally {
      cargando.value = false
    }
  }

  async function cerrarSesion() {
    await $fetch('/api/logout', { method: 'POST' })
    sesion.value = { autenticado: false }
  }

  return { sesion, cargando, cargarSesion, cerrarSesion }
}
