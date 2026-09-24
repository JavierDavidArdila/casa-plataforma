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
  <div class="flex flex-col items-center gap-[50px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Iniciar sesión</h1>

    <form class="flex w-full max-w-[497px] flex-col items-center gap-[50px]" @submit.prevent="entrar">
      <div class="flex w-full flex-col gap-[10px]">
        <label class="flex flex-col gap-[10px]">
          <span class="etiqueta-casa">Usuario</span>
          <input v-model="usuario" type="text" required placeholder="Nombre usuario" class="campo-casa" />
        </label>

        <label class="mt-[10px] flex flex-col gap-[10px]">
          <span class="etiqueta-casa">Contraseña</span>
          <input v-model="password" type="password" required placeholder="Tu contraseña" class="campo-casa" />
        </label>

        <div class="flex justify-end">
          <button type="button" class="text-[12px] font-semibold text-[var(--color-gris-dk)]" disabled>Recuperar contraseña</button>
        </div>

        <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      </div>

      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Entrando...' : 'Entrar' }}</BotonCasa>
    </form>
  </div>
</template>
