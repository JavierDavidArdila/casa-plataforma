<script setup lang="ts">
useSeoPagina({ title: 'Recuperar contraseña — C.A.S.A.', description: 'Recupera el acceso a tu cuenta de C.A.S.A.', indexable: false })

const usuario = ref('')
const enviando = ref(false)
const enviado = ref(false)
const error = ref<string | null>(null)

async function enviar() {
  enviando.value = true
  error.value = null
  try {
    await $fetch('/api/recuperar-clave', { method: 'POST', body: { usuario: usuario.value } })
    enviado.value = true
  } catch {
    error.value = 'No pudimos procesar la solicitud. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Recuperar contraseña</h1>

    <div v-if="enviado" class="flex max-w-[497px] flex-col items-center gap-[20px] text-center text-[16px] text-[var(--color-gris-dk)]">
      <p>
        Si hay una cuenta con ese correo o usuario, te enviamos un enlace para crear una contraseña nueva. Revisa tu
        bandeja de entrada (y la carpeta de spam). El enlace vence en 1 hora.
      </p>
      <BotonCasa to="/iniciar-sesion">Volver a iniciar sesión</BotonCasa>
    </div>

    <form v-else class="flex w-full max-w-[497px] flex-col items-center gap-[30px]" @submit.prevent="enviar">
      <p class="text-center text-[16px] text-[var(--color-gris-dk)]">
        Escribe el correo con el que te inscribiste o tu código de usuario y te enviaremos un enlace para crear una
        contraseña nueva.
      </p>
      <label class="flex w-full flex-col gap-[10px]">
        <span class="etiqueta-casa">Correo o usuario</span>
        <input v-model="usuario" type="text" required autocomplete="username" placeholder="tucorreo@ejemplo.com" class="campo-casa" />
      </label>
      <p v-if="error" class="w-full text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar enlace' }}</BotonCasa>
    </form>
  </div>
</template>
