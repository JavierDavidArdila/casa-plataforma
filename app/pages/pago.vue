<script setup lang="ts">
// Dos modos, decididos por el servidor (/api/pago-estado):
// - "simulado": no hay pasarela conectada; el botón activa la suscripción sin cobrar.
// - "hotmart": se paga en el checkout de Hotmart; la suscripción la activa el aviso
//   firmado de Hotmart (/api/hotmart) y esta página solo espera a que llegue.
useSeoPagina({ title: 'Suscripción — C.A.S.A.', description: 'Suscripción a la plataforma C.A.S.A.', indexable: false })

interface EstadoPago {
  modo: 'simulado' | 'hotmart'
  cupoGratisAgotado: boolean
  gratis: boolean
  suscrito: boolean
  codigoUsuario: string | null
  checkoutUrl: string | null
  email: string
  nombre: string
}

const CLAVE_PAGO_INICIADO = 'casa-pago-iniciado'
const INTERVALO_MS = 4000
const MAX_INTENTOS = 45 // ~3 minutos

const cargando = ref(true)
const estado = ref<EstadoPago | null>(null)
// El cliente pidió (30 sep) no ofrecer por ahora el libro junto con la suscripción.
const incluyeLibro = false
const enviando = ref(false)
const error = ref<string | null>(null)
const esperandoConfirmacion = ref(false)
const sinConfirmar = ref(false)
let temporizador: ReturnType<typeof setTimeout> | undefined

const codigoUsuario = computed(() => (estado.value?.suscrito ? estado.value.codigoUsuario : null))

const enlaceHotmart = computed(() => {
  if (!estado.value?.checkoutUrl) return '#'
  const url = new URL(estado.value.checkoutUrl)
  url.searchParams.set('email', estado.value.email)
  url.searchParams.set('name', estado.value.nombre)
  return url.toString()
})

async function consultar() {
  estado.value = await $fetch<EstadoPago>('/api/pago-estado', { method: 'POST' })
  if (estado.value.suscrito) {
    localStorage.removeItem(CLAVE_PAGO_INICIADO)
    esperandoConfirmacion.value = false
    const { cargarSesion } = useAuth()
    await cargarSesion()
  }
}

async function esperarConfirmacion(intento = 0) {
  esperandoConfirmacion.value = true
  sinConfirmar.value = false
  try {
    await consultar()
  } catch {
    /* seguimos intentando */
  }
  if (estado.value?.suscrito) return
  if (intento >= MAX_INTENTOS) {
    esperandoConfirmacion.value = false
    sinConfirmar.value = true
    return
  }
  temporizador = setTimeout(() => esperarConfirmacion(intento + 1), INTERVALO_MS)
}

// El checkout se abre en otra pestaña: aquí quedamos esperando el aviso de Hotmart.
// La marca va en localStorage para que también la vea la pestaña a la que Hotmart
// devuelve al usuario después de pagar.
function iralCheckout() {
  localStorage.setItem(CLAVE_PAGO_INICIADO, '1')
  esperarConfirmacion()
}

async function confirmarPagoSimulado() {
  enviando.value = true
  error.value = null
  try {
    await $fetch('/api/pago', { method: 'POST', body: { incluyeLibro } })
    await consultar()
  } catch {
    error.value = 'No pudimos activar tu suscripción. Si no has creado tu cuenta, empieza por ahí.'
  } finally {
    enviando.value = false
  }
}

onMounted(async () => {
  try {
    await consultar()
    if (estado.value?.modo === 'hotmart' && !estado.value.suscrito && localStorage.getItem(CLAVE_PAGO_INICIADO)) {
      esperarConfirmacion()
    }
  } catch {
    error.value = 'No encontramos tu sesión. Empieza por el registro y el cuestionario.'
  } finally {
    cargando.value = false
  }
})

onBeforeUnmount(() => clearTimeout(temporizador))
</script>

<template>
  <div class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <p v-if="cargando" class="text-[16px] text-[var(--color-gris-dk)]">Cargando…</p>

    <template v-else-if="codigoUsuario">
      <h1 class="titulo-seccion">¡Listo! Tu suscripción está activa</h1>
      <p v-if="estado?.gratis" class="text-[14px] text-[var(--color-gris-dk)]">Eres uno de los 100 primeros inscritos: tu acceso es sin costo.</p>
      <p class="text-[16px] text-[var(--color-gris-dk)]">Este es tu número de usuario. Lo necesitas para iniciar sesión.</p>
      <p class="rounded-[30px] bg-white px-[40px] py-[20px] text-[36px] font-bold tracking-widest text-[var(--color-secundario)]">
        {{ codigoUsuario }}
      </p>
      <BotonCasa to="/contenidos">Ir a Contenidos</BotonCasa>
    </template>

    <template v-else-if="!estado">
      <h1 class="titulo-seccion">Activa tu suscripción</h1>
      <p class="text-[16px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      <BotonCasa to="/registrarse">Ir al registro</BotonCasa>
    </template>

    <!-- Pago real con Hotmart -->
    <template v-else-if="estado.modo === 'hotmart'">
      <h1 class="titulo-seccion">Activa tu suscripción</h1>
      <p v-if="estado.cupoGratisAgotado" class="max-w-[497px] text-center text-[14px] text-[var(--color-gris-dk)]">
        Los 100 primeros inscritos ya completaron su acceso gratuito; desde ahora la suscripción tiene costo.
      </p>

      <div v-if="esperandoConfirmacion" class="flex max-w-[497px] flex-col items-center gap-[15px] text-center">
        <p class="text-[16px] font-bold text-[var(--color-gris-dk)]">Estamos confirmando tu pago…</p>
        <p class="text-[14px] text-[var(--color-gris-dk)]">
          Puede tardar unos segundos. No cierres esta página: apenas Hotmart nos avise, verás tu número de usuario.
        </p>
      </div>

      <div v-else class="flex w-full max-w-[497px] flex-col items-center gap-[20px] text-center">
        <p v-if="sinConfirmar" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">
          Todavía no recibimos la confirmación de tu pago. Si ya pagaste, espera un momento y verifica de nuevo. Si el
          problema continúa, escríbenos a fernando@ahorasoypapademispapas.com con el email que usaste al pagar.
        </p>
        <p class="text-[16px] text-[var(--color-gris-dk)]">
          Vas a completar el pago de forma segura en Hotmart. Usa el mismo email con el que te registraste
          (<strong>{{ estado.email }}</strong>) para que podamos activar tu suscripción.
        </p>
        <BotonCasa :href="enlaceHotmart" @click="iralCheckout">Pagar con Hotmart</BotonCasa>
        <BotonCasa v-if="sinConfirmar" sin-flecha @click="esperarConfirmacion()">Ya pagué, verificar</BotonCasa>
      </div>
    </template>

    <!-- Pago simulado (sin pasarela conectada) -->
    <template v-else>
      <h1 class="titulo-seccion">Activa tu suscripción</h1>
      <p class="rounded-[10px] bg-white px-4 py-2 text-center text-[14px] text-[var(--color-gris-dk)]">
        Pago de prueba — todavía no está conectada una pasarela real de pago.
      </p>

      <div class="flex w-full max-w-[497px] flex-col gap-[15px] rounded-[30px] bg-white p-[30px] text-[var(--color-gris-dk)]">
        <div class="flex items-center justify-between">
          <span class="text-[16px] font-bold">Suscripción C.A.S.A.</span>
          <span class="text-[16px] font-bold">$—</span>
        </div>
      </div>

      <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>

      <BotonCasa :disabled="enviando" sin-flecha @click="confirmarPagoSimulado">
        {{ enviando ? 'Procesando...' : 'Confirmar pago (simulado)' }}
      </BotonCasa>
    </template>
  </div>
</template>
