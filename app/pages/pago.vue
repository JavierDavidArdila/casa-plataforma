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
  <div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
    <template v-if="!codigoUsuario">
      <h1 class="text-center text-2xl font-bold text-[var(--color-azul)]">Activa tu suscripción</h1>
      <p class="rounded-[var(--radius-editorial)] bg-[var(--color-fondo)] px-4 py-2 text-center text-xs text-[var(--color-texto-suave)]">
        Pago de prueba — todavía no está conectada una pasarela real de pago.
      </p>

      <div class="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-5">
        <div class="flex items-center justify-between">
          <span class="font-medium">Suscripción C.A.S.A.</span>
          <span class="font-semibold">$—</span>
        </div>
        <label class="flex items-center gap-2 text-sm text-[var(--color-texto-suave)]">
          <input v-model="incluyeLibro" type="checkbox" />
          Incluir libro "¡Ahora soy papá de mis papás!" (opcional)
        </label>
      </div>

      <p v-if="error" class="text-sm text-[var(--color-terracota)]">{{ error }}</p>

      <button
        type="button"
        :disabled="enviando"
        class="inline-flex items-center justify-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white disabled:opacity-50"
        @click="confirmarPago"
      >
        {{ enviando ? 'Procesando...' : 'Confirmar pago (simulado)' }}
      </button>
    </template>

    <template v-else>
      <div class="flex flex-col items-center gap-4 text-center">
        <h1 class="text-2xl font-bold text-[var(--color-azul)]">¡Listo! Tu suscripción está activa</h1>
        <p class="text-sm text-[var(--color-texto-suave)]">Este es tu número de usuario. Lo necesitas para iniciar sesión.</p>
        <p class="rounded-[var(--radius-card)] bg-[var(--color-fondo)] px-8 py-4 text-4xl font-bold tracking-widest text-[var(--color-azul)]">
          {{ codigoUsuario }}
        </p>
        <NuxtLink
          to="/contenidos"
          class="inline-flex items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white"
        >
          Ir a Contenidos →
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
