<script setup lang="ts">
useSeoMeta({ title: 'Crear cuenta — C.A.S.A.' })

const password = ref('')
const confirmar = ref('')
const enviando = ref(false)
const error = ref<string | null>(null)

async function crear() {
  error.value = null
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (password.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  enviando.value = true
  try {
    await $fetch('/api/cuenta', { method: 'POST', body: { password: password.value } })
    await navigateTo('/pago')
  } catch {
    error.value = 'No pudimos crear tu cuenta. Si no has hecho el cuestionario, empieza por ahí.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Crea tu cuenta</h1>
    <p class="max-w-[497px] text-center text-[16px] text-[var(--color-gris-dk)]">
      Con esto podrás iniciar sesión más adelante. El siguiente paso es activar tu suscripción.
    </p>

    <form class="flex w-full max-w-[497px] flex-col items-center gap-[30px]" @submit.prevent="crear">
      <div class="flex w-full flex-col gap-[25px]">
        <input v-model="password" type="password" required placeholder="Contraseña" aria-label="Contraseña" class="campo-casa" />
        <input v-model="confirmar" type="password" required placeholder="Confirmar contraseña" aria-label="Confirmar contraseña" class="campo-casa" />
        <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      </div>
      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Creando...' : 'Continuar al pago' }}</BotonCasa>
    </form>
  </div>
</template>
