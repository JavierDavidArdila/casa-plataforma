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
  <section id="comuniquemonos" class="scroll-mt-6 border-t border-[#dcdcdc] p-[50px] text-[var(--color-gris-dk)]">
    <div class="grid gap-[50px] lg:grid-cols-[497px_497px] lg:justify-between">
      <div class="flex flex-col gap-[30px]">
        <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Comuniquémonos</h2>
        <p class="text-[16px] leading-[1.75]">
          Queremos escucharte y te presentamos las diferentes vías para que interactuemos: Escríbenos ahora en el
          formulario o por WhatsApp. Nos encuentras en:<br />
          <a href="mailto:fernando@ahorasoypapademispapas.com" class="hover:underline">fernando@ahorasoypapademispapas.com</a><br />
          <a href="https://wa.me/573153350785" target="_blank" rel="noopener" class="hover:underline">+57 315 335 0785</a>
        </p>
      </div>

      <form v-if="estado !== 'exito'" class="flex flex-col gap-[25px]" @submit.prevent="enviarFormulario">
        <div class="grid gap-4 sm:grid-cols-2">
          <input v-model="nombre" type="text" required placeholder="Nombre*" class="campo-casa" />
          <input v-model="apellido" type="text" required placeholder="Apellido*" class="campo-casa" />
        </div>
        <input v-model="email" type="email" required placeholder="Email*" class="campo-casa" />
        <input v-model="telefono" type="tel" required placeholder="Teléfono*" class="campo-casa" />
        <input v-model="empresa" type="text" placeholder="Empresa" class="campo-casa" />
        <select v-model="asunto" required class="campo-casa" :class="{ vacio: !asunto }">
          <option value="" disabled>Selecciona el asunto</option>
          <option v-for="opcion in asuntos" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
        <textarea v-model="mensaje" rows="3" placeholder="Escribe el mensaje" style="height:89px;font-size:16px" class="campo-casa" />

        <input v-model="honeypot" type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off" />

        <BotonCasa type="submit" :disabled="estado === 'enviando'">
          {{ estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje' }}
        </BotonCasa>

        <p v-if="estado === 'error'" class="text-sm text-[var(--color-gris-dk)]">
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
        <p class="text-[24px] font-bold text-[var(--color-secundario)]">¡Gracias por escribirnos!</p>
        <p class="text-[16px]">Te responderemos lo antes posible.</p>
      </div>
    </div>
  </section>
</template>
