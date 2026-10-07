<script setup lang="ts">
import { REGLAS_CLAVE, claveValida } from '#shared/utils/clave'

useSeoPagina({ title: 'Nueva contraseña — C.A.S.A.', description: 'Crea una contraseña nueva para tu cuenta de C.A.S.A.', indexable: false })

const route = useRoute()
const token = String(route.query.token ?? '')

const password = ref('')
const confirmar = ref('')
const reglas = computed(() => REGLAS_CLAVE.map((r) => ({ ...r, ok: r.cumple(password.value) })))
const enviando = ref(false)
const error = ref<string | null>(null)

async function guardar() {
  error.value = null
  if (!claveValida(password.value)) {
    error.value = 'La contraseña no cumple con las condiciones mínimas.'
    return
  }
  if (password.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  enviando.value = true
  try {
    await $fetch('/api/restablecer-clave', { method: 'POST', body: { token, password: password.value } })
    const { cargarSesion } = useAuth()
    await cargarSesion()
    await navigateTo('/contenidos/comprender')
  } catch (e) {
    error.value = (e as { statusMessage?: string })?.statusMessage || 'No pudimos cambiar la contraseña. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Crea tu contraseña nueva</h1>

    <div v-if="!token" class="flex max-w-[497px] flex-col items-center gap-[20px] text-center text-[16px] text-[var(--color-gris-dk)]">
      <p>Este enlace no es válido. Pide uno nuevo.</p>
      <BotonCasa to="/recuperar-clave">Recuperar contraseña</BotonCasa>
    </div>

    <form v-else class="flex w-full max-w-[497px] flex-col items-center gap-[30px]" @submit.prevent="guardar">
      <div class="flex w-full flex-col gap-[25px]">
        <input v-model="password" type="password" required autocomplete="new-password" placeholder="Contraseña nueva" aria-label="Contraseña nueva" class="campo-casa" />
        <ul class="flex flex-col gap-1 px-2 text-[14px]" aria-label="Condiciones de la contraseña">
          <li v-for="regla in reglas" :key="regla.id" :class="regla.ok ? 'text-[#2f9e5b]' : 'text-[var(--color-gris-dk)]'">
            {{ regla.ok ? '✓' : '•' }} {{ regla.texto }}
          </li>
        </ul>
        <input v-model="confirmar" type="password" required autocomplete="new-password" placeholder="Confirmar contraseña" aria-label="Confirmar contraseña" class="campo-casa" />
        <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      </div>
      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Guardando...' : 'Guardar y entrar' }}</BotonCasa>
      <NuxtLink v-if="error" to="/recuperar-clave" class="text-[14px] font-bold text-[var(--color-secundario)] underline">Pedir un enlace nuevo</NuxtLink>
    </form>
  </div>
</template>
