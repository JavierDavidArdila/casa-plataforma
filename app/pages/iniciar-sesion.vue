<script setup lang="ts">
import { AVISO_REGISTRO_ACTIVIDAD } from '~/data/opinion-acceso'

useSeoPagina({ title: 'Iniciar sesión — C.A.S.A.', description: 'Ingresa a la plataforma C.A.S.A.', indexable: false })

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

const mostrarClave = ref(false)
const codigoClave = ref('')
const enviandoClave = ref(false)
const errorClave = ref<string | null>(null)

async function entrarClave() {
  enviandoClave.value = true
  errorClave.value = null
  try {
    let origen: unknown
    try {
      origen = JSON.parse(sessionStorage.getItem('casa-origen') ?? 'null') ?? undefined
    } catch {
      origen = undefined
    }
    await $fetch('/api/acceso', { method: 'POST', body: { codigo: codigoClave.value, origen } })
    const { cargarSesion } = useAuth()
    await cargarSesion()
    await navigateTo('/contenidos')
  } catch (e) {
    errorClave.value = (e as { statusMessage?: string })?.statusMessage || 'No pudimos validar el código. Inténtalo de nuevo.'
  } finally {
    enviandoClave.value = false
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

    <div class="flex w-full max-w-[497px] flex-col items-center gap-[20px] border-t border-[var(--color-gris-dk)]/20 pt-[30px]">
      <button
        type="button"
        class="text-[16px] font-bold text-[var(--color-secundario)] underline"
        :aria-expanded="mostrarClave"
        @click="mostrarClave = !mostrarClave"
      >
        Tengo una clave de acceso
      </button>

      <form v-if="mostrarClave" class="flex w-full flex-col items-center gap-[30px]" @submit.prevent="entrarClave">
        <label class="flex w-full flex-col gap-[10px]">
          <span class="etiqueta-casa">Tu clave de acceso (está en tu tarjeta)</span>
          <input
            v-model="codigoClave"
            type="text"
            required
            maxlength="20"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="XXXX-XXXX-XXXX"
            class="campo-casa uppercase tracking-[2px]"
          />
        </label>
        <p class="w-full text-[12px] text-[var(--color-gris-dk)]">{{ AVISO_REGISTRO_ACTIVIDAD }}</p>
        <p v-if="errorClave" class="w-full text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ errorClave }}</p>
        <BotonCasa type="submit" :disabled="enviandoClave">{{ enviandoClave ? 'Validando...' : 'Entrar' }}</BotonCasa>
      </form>
    </div>
  </div>
</template>
