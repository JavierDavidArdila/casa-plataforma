<script setup lang="ts">
useSeoMeta({ title: 'Regístrate — C.A.S.A.' })

const form = reactive({
  nombre: '',
  apellido: '',
  edad: '',
  fechaNacimiento: '',
  genero: '',
  email: '',
  movil: '',
  paisOrigen: '',
  paisResidencia: '',
  ciudad: '',
  aQuienAyudas: '',
  haceCuantoVivesFuera: '',
})

const enviando = ref(false)
const error = ref<string | null>(null)

async function enviar() {
  enviando.value = true
  error.value = null
  try {
    await $fetch('/api/lead', { method: 'POST', body: form })
    await navigateTo('/test')
  } catch {
    error.value = 'No pudimos guardar tus datos. Revisa el formulario e intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-2xl font-bold text-[var(--color-azul)]">Antes de empezar, cuéntanos de ti</h1>
      <p class="text-sm text-[var(--color-texto-suave)]">
        Con estos datos personalizamos tu resultado y te enviamos tu diagnóstico al correo.
      </p>
    </div>

    <form class="grid gap-5 sm:grid-cols-2" @submit.prevent="enviar">
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Nombre</span>
        <input v-model="form.nombre" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Apellido</span>
        <input v-model="form.apellido" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Edad</span>
        <input v-model="form.edad" type="number" min="1" max="120" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Fecha de nacimiento</span>
        <input v-model="form.fechaNacimiento" type="date" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Género</span>
        <select v-model="form.genero" required class="campo">
          <option value="" disabled>Selecciona una opción</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="otro">Otro</option>
          <option value="prefiero-no-decir">Prefiero no decir</option>
        </select>
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Email</span>
        <input v-model="form.email" type="email" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Móvil</span>
        <input v-model="form.movil" type="tel" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">País de origen</span>
        <input v-model="form.paisOrigen" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">País de residencia</span>
        <input v-model="form.paisResidencia" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">Ciudad</span>
        <input v-model="form.ciudad" required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">¿A quién ayudas?</span>
        <input v-model="form.aQuienAyudas" placeholder="Ej. Mi papá, mi mamá..." required class="campo" />
      </label>
      <label class="flex flex-col gap-1.5 text-sm">
        <span class="font-medium">¿Hace cuánto vives fuera? (años)</span>
        <input v-model="form.haceCuantoVivesFuera" type="number" min="0" max="80" required class="campo" />
      </label>

      <p v-if="error" class="sm:col-span-2 text-sm text-[var(--color-terracota)]">{{ error }}</p>

      <button
        type="submit"
        :disabled="enviando"
        class="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {{ enviando ? 'Guardando...' : 'Continuar al test' }} →
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
