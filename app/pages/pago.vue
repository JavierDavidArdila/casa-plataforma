<script setup lang="ts">
// Pago SIMULADO — no hay pasarela real conectada todavía (pendiente de
// decisión de negocio). Este paso activa la suscripción y muestra el código
// de usuario de 6 dígitos.
useSeoMeta({ title: 'Suscripción — C.A.S.A.' })

const incluyeLibro = ref(false)
const enviando = ref(false)
const error = ref<string | null>(null)
const codigoUsuario = ref<string | null>(null)

async function confirmarPago() {
  enviando.value = true
  error.value = null
  try {
    const respuesta = await $fetch<{ ok: boolean; codigoUsuario: string }>('/api/pago', {
      method: 'POST',
      body: { incluyeLibro: incluyeLibro.value },
    })
    codigoUsuario.value = respuesta.codigoUsuario
    const { cargarSesion } = useAuth()
    await cargarSesion()
  } catch {
    error.value = 'No pudimos activar tu suscripción. Si no has creado tu cuenta, empieza por ahí.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <template v-if="!codigoUsuario">
      <h1 class="titulo-seccion">Activa tu suscripción</h1>
      <p class="rounded-[10px] bg-white px-4 py-2 text-center text-[14px] text-[var(--color-gris-dk)]">
        Pago de prueba — todavía no está conectada una pasarela real de pago.
      </p>

      <div class="flex w-full max-w-[497px] flex-col gap-[15px] rounded-[30px] bg-white p-[30px] text-[var(--color-gris-dk)]">
        <div class="flex items-center justify-between">
          <span class="text-[16px] font-bold">Suscripción C.A.S.A.</span>
          <span class="text-[16px] font-bold">$—</span>
        </div>
        <label class="flex items-center gap-2 text-[16px]">
          <input v-model="incluyeLibro" type="checkbox" class="accent-[var(--color-primario)]" />
          Incluir libro "¡Ahora soy papá de mis papás!" (opcional)
        </label>
      </div>

      <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>

      <BotonCasa :disabled="enviando" sin-flecha @click="confirmarPago">
        {{ enviando ? 'Procesando...' : 'Confirmar pago (simulado)' }}
      </BotonCasa>
    </template>

    <template v-else>
      <h1 class="titulo-seccion">¡Listo! Tu suscripción está activa</h1>
      <p class="text-[16px] text-[var(--color-gris-dk)]">Este es tu número de usuario. Lo necesitas para iniciar sesión.</p>
      <p class="rounded-[30px] bg-white px-[40px] py-[20px] text-[36px] font-bold tracking-widest text-[var(--color-secundario)]">
        {{ codigoUsuario }}
      </p>
      <BotonCasa to="/contenidos">Ir a Contenidos</BotonCasa>
    </template>
  </div>
</template>
