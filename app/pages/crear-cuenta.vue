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
    error.value = 'No pudimos crear tu cuenta. Si no has hecho el test, empieza por ahí.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16">
    <h1 class="text-center text-2xl font-bold text-[var(--color-azul)]">Crea tu cuenta</h1>
    <p class="text-center text-sm text-[var(--color-texto-suave)]">
      Con esto podrás iniciar sesión más adelante. El siguiente paso es activar tu suscripción.
    </p>

    <form class="flex flex-col gap-4" @submit.prevent="crear">
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Contraseña</span>
        <input v-model="password" type="password" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Confirmar contraseña</span>
        <input v-model="confirmar" type="password" required class="campo" />
      </label>

      <p v-if="error" class="text-sm text-[var(--color-terracota)]">{{ error }}</p>

      <button
        type="submit"
        :disabled="enviando"
        class="mt-2 inline-flex items-center justify-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {{ enviando ? 'Creando...' : 'Continuar al pago' }} →
      </button>
    </form>
  </div>
</template>

<style scoped>
.campo {
  border: 1px solid var(--color-borde);
  background: var(--color-superficie);
  border-radius: 9999px;
  padding: 0.65rem 1.25rem;
  outline: none;
}
.campo:focus {
  border-color: var(--color-azul);
}
</style>
