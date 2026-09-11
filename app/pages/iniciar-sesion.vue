<script setup lang="ts">
useSeoMeta({ title: 'Iniciar sesión — C.A.S.A.' })

const usuario = ref('')
const password = ref('')
const enviando = ref(false)
const error = ref<string | null>(null)

async function entrar() {
  enviando.value = true
  error.value = null
  try {
    await $fetch('/api/login', { method: 'POST', body: { usuario: usuario.value, password: password.value } })
    const { cargarSesion } = useAuth()
    await cargarSesion()
    await navigateTo('/contenidos')
  } catch {
    error.value = 'Usuario o contraseña incorrectos.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center px-6 py-16">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-2xl font-bold text-[var(--color-azul)]">Iniciar sesión</h1>

      <form class="flex flex-col gap-5" @submit.prevent="entrar">
        <label class="flex flex-col gap-1.5 text-sm">
          <span class="font-medium text-[var(--color-azul)]">Usuario</span>
          <input
            v-model="usuario"
            type="text"
            required
            placeholder="Nombre usuario"
            class="rounded-full border border-[var(--color-borde)] bg-[var(--color-superficie)] px-4 py-2.5 outline-none focus:border-[var(--color-azul)]"
          />
        </label>

        <label class="flex flex-col gap-1.5 text-sm">
          <span class="font-medium text-[var(--color-azul)]">Contraseña</span>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Tu contraseña"
            class="rounded-full border border-[var(--color-borde)] bg-[var(--color-superficie)] px-4 py-2.5 outline-none focus:border-[var(--color-azul)]"
          />
        </label>

        <p v-if="error" class="text-sm text-[var(--color-terracota)]">{{ error }}</p>

        <div class="flex items-center justify-between">
          <span />
          <button type="button" class="text-xs text-[var(--color-texto-suave)]" disabled>Recuperar contraseña</button>
        </div>

        <button
          type="submit"
          :disabled="enviando"
          class="mx-auto inline-flex items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-8 py-2.5 font-medium text-white disabled:opacity-50"
        >
          {{ enviando ? 'Entrando...' : 'Entrar' }} →
        </button>
      </form>
    </div>
  </div>
</template>
