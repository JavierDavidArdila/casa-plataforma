<script setup lang="ts">
const config = useRuntimeConfig()

const nombre = ref('')
const apellido = ref('')
const email = ref('')
const telefono = ref('')
const empresa = ref('')
const asunto = ref('')
const mensaje = ref('')
const honeypot = ref('')

const asuntos = [
  'Contenidos de la plataforma',
  'Libro',
  'Conferencias y cursos',
  'Mentorías de familia',
  'Prensa / medios',
  'Otro',
]

const estado = ref<'inactivo' | 'enviando' | 'exito' | 'error'>('inactivo')
const claveConfigurada = computed(() => Boolean(config.public.web3formsKey))

async function enviarFormulario() {
  if (honeypot.value) return
  if (!claveConfigurada.value) {
    estado.value = 'error'
    return
  }

  estado.value = 'enviando'
  try {
    const respuesta = await $fetch<{ success: boolean }>('https://api.web3forms.com/submit', {
      method: 'POST',
      body: {
        access_key: config.public.web3formsKey,
        subject: 'Nuevo mensaje desde la Plataforma C.A.S.A.',
        from_name: `${nombre.value} ${apellido.value}`.trim(),
        name: `${nombre.value} ${apellido.value}`.trim(),
        email: email.value,
        telefono: telefono.value,
        empresa: empresa.value,
        asunto: asunto.value,
        message: mensaje.value,
      },
    })

    if (respuesta.success) {
      estado.value = 'exito'
      nombre.value = ''
      apellido.value = ''
      email.value = ''
      telefono.value = ''
      empresa.value = ''
      asunto.value = ''
      mensaje.value = ''
    } else {
      estado.value = 'error'
    }
  } catch {
    estado.value = 'error'
  }
}
</script>

<template>
  <section id="comuniquemonos" class="scroll-mt-6 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-azul-alto)] p-8 text-white md:p-12">
    <div class="grid gap-10 md:grid-cols-2">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold md:text-3xl">Comuniquémonos</h2>
        <p class="text-sm text-white/85">
          Queremos escucharte y te presentamos las diferentes vías para que interactuemos: escríbenos ahora en
          el formulario o por WhatsApp.
        </p>
        <p class="text-sm text-white/85">
          Nos encuentras en:
          <a href="mailto:fernando@ahorasoypapademispapas.com" class="underline">fernando@ahorasoypapademispapas.com</a>
        </p>
        <a href="tel:+573153350785" class="text-sm font-semibold text-white/95">+57 315 335 0785</a>
      </div>

      <form v-if="estado !== 'exito'" class="flex flex-col gap-4" @submit.prevent="enviarFormulario">
        <div class="grid gap-4 sm:grid-cols-2">
          <input v-model="nombre" type="text" required placeholder="Nombre*" class="campo-oscuro" />
          <input v-model="apellido" type="text" required placeholder="Apellido*" class="campo-oscuro" />
        </div>
        <input v-model="email" type="email" required placeholder="Email*" class="campo-oscuro" />
        <input v-model="telefono" type="tel" required placeholder="Teléfono*" class="campo-oscuro" />
        <input v-model="empresa" type="text" placeholder="Empresa" class="campo-oscuro" />
        <select v-model="asunto" class="campo-oscuro">
          <option value="" disabled>Selecciona el asunto</option>
          <option v-for="opcion in asuntos" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
        <textarea v-model="mensaje" rows="3" placeholder="Escribe el mensaje" class="campo-oscuro resize-none" />

        <input v-model="honeypot" type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off" />

        <button
          type="submit"
          :disabled="estado === 'enviando'"
          class="inline-flex w-fit items-center gap-2 rounded-[10px] bg-[var(--color-naranja)] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {{ estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje' }} →
        </button>

        <p v-if="estado === 'error'" class="text-sm text-[var(--color-naranja)]">
          <template v-if="!claveConfigurada">
            El formulario aún no tiene configurada la clave de Web3Forms
            (variable <code>NUXT_PUBLIC_WEB3FORMS_KEY</code>).
          </template>
          <template v-else>
            No pudimos enviar tu mensaje. Escríbenos directamente a fernando@ahorasoypapademispapas.com.
          </template>
        </p>
      </form>

      <div v-else class="flex flex-col justify-center gap-2">
        <p class="text-xl font-bold">¡Gracias por escribirnos!</p>
        <p class="text-sm text-white/85">Te responderemos lo antes posible.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.campo-oscuro {
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-texto);
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  outline: none;
}
.campo-oscuro::placeholder {
  color: var(--color-texto-suave);
}
</style>
