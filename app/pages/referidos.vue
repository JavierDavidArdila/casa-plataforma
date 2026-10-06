<script setup lang="ts">
import { PAISES_ORIGEN } from '~/data/ubicaciones'

useSeoPagina({ title: 'Comparte C.A.S.A. — C.A.S.A.', description: 'Comparte C.A.S.A. con tres familiares o amigos.', indexable: false })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

const form = reactive({
  nombre: '',
  apellido: '',
  paisOrigen: '',
  paisResidencia: '',
  comoLlegaste: '' as '' | 'clave' | 'primeros100',
  clave: '',
})
const referidos = reactive([0, 1, 2].map(() => ({ nombre: '', apellido: '', email: '', celular: '' })))

const enviando = ref(false)
const enviado = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
  if (!sesion.value.suscrito) await navigateTo('/')
})

async function enviar() {
  error.value = null
  if (!form.comoLlegaste) {
    error.value = 'Cuéntanos cómo llegaste a C.A.S.A.'
    return
  }
  enviando.value = true
  try {
    await $fetch('/api/referidos', { method: 'POST', body: { ...form, referidos } })
    enviado.value = true
    await cargarSesion()
  } catch (e) {
    error.value = (e as { statusMessage?: string })?.statusMessage || 'No pudimos guardar tus referidos. Revisa el formulario e intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div v-if="!verificando && sesion.suscrito" class="flex flex-col items-center gap-[30px] px-[30px] py-[30px]">
    <template v-if="enviado">
      <h1 class="titulo-seccion">Gracias por compartir bienestar con ellos</h1>
      <p class="max-w-[497px] text-center text-[16px] text-[var(--color-gris-dk)]">
        Seguro te lo agradecerán. Espera en pocos días ver el último contenido de la Primera Temporada de C.A.S.A.
        <strong>Esta es tu C.A.S.A.</strong>
      </p>
      <BotonCasa to="/contenidos/aliviar">Ir a Aliviar</BotonCasa>
    </template>

    <template v-else>
      <h1 class="titulo-seccion">¡Felicitaciones!</h1>
      <div class="flex max-w-[497px] flex-col gap-[12px] text-center text-[16px] text-[var(--color-gris-dk)]">
        <p>Vemos que ya llegaste a SOSTENER, el tercer contenido de C.A.S.A. en su Primera Temporada.</p>
        <p>Estás a punto de cerrar con el cuarto pilar: ALIVIAR.</p>
        <p>
          Y si has llegado hasta acá, es porque seguro te ha aportado a tu bienestar emocional y a cuidar a la distancia con
          nuevas herramientas. Por ello queremos pedirte si le puedes compartir estos beneficios a tres familiares o amigos que
          estén viviendo una situación similar. Seguro te lo agradecerán.
        </p>
      </div>

      <form class="flex w-full max-w-[497px] flex-col items-center gap-[30px]" @submit.prevent="enviar">
        <div class="flex w-full flex-col gap-[25px]">
          <input v-model="form.nombre" required placeholder="Tu nombre*" aria-label="Tu nombre" class="campo-casa" />
          <input v-model="form.apellido" required placeholder="Tu apellido*" aria-label="Tu apellido" class="campo-casa" />
          <select v-model="form.paisOrigen" required aria-label="Tu país de origen" class="campo-casa" :class="{ vacio: !form.paisOrigen }">
            <option value="" disabled>Tu país de origen*</option>
            <option v-for="pais in PAISES_ORIGEN" :key="pais" :value="pais">{{ pais }}</option>
          </select>
          <select v-model="form.paisResidencia" required aria-label="Tu país de residencia" class="campo-casa" :class="{ vacio: !form.paisResidencia }">
            <option value="" disabled>Tu país de residencia*</option>
            <option value="Canadá">Canadá</option>
            <option value="Estados Unidos">Estados Unidos</option>
          </select>

          <p class="px-[20px] text-[16px] font-bold text-[var(--color-gris-dk)]">Tus tres referidos son:</p>
          <fieldset v-for="(r, i) in referidos" :key="i" class="flex flex-col gap-[15px] rounded-[30px] bg-white p-[25px]">
            <legend class="etiqueta-casa px-[8px]">Referido {{ i + 1 }}</legend>
            <input v-model="r.nombre" required placeholder="Nombre*" :aria-label="`Referido ${i + 1}: nombre`" class="campo-casa" />
            <input v-model="r.apellido" required placeholder="Apellido*" :aria-label="`Referido ${i + 1}: apellido`" class="campo-casa" />
            <input v-model="r.email" type="email" required placeholder="Email*" :aria-label="`Referido ${i + 1}: email`" class="campo-casa" />
            <input v-model="r.celular" type="tel" inputmode="tel" required placeholder="Celular*" :aria-label="`Referido ${i + 1}: celular`" class="campo-casa" />
          </fieldset>

          <fieldset class="flex flex-col gap-[12px] px-[20px]">
            <legend class="etiqueta-casa mb-[8px]">Antes de enviar, confírmanos cómo llegaste a C.A.S.A.*</legend>
            <label class="flex cursor-pointer items-center gap-[10px] text-[16px] text-[var(--color-gris-dk)]">
              <input v-model="form.comoLlegaste" type="radio" name="como" value="clave" class="accent-[var(--color-primario)]" />
              Con una clave de Periodista / Invitado Especial
            </label>
            <input
              v-if="form.comoLlegaste === 'clave'"
              v-model="form.clave"
              required
              placeholder="Tu clave (XXXX-XXXX-XXXX)"
              aria-label="Clave de Periodista o Invitado Especial"
              autocomplete="off"
              class="campo-casa"
            />
            <label class="flex cursor-pointer items-center gap-[10px] text-[16px] text-[var(--color-gris-dk)]">
              <input v-model="form.comoLlegaste" type="radio" name="como" value="primeros100" class="accent-[var(--color-primario)]" />
              ¡Soy uno de los 100 primeros inscritos!
            </label>
          </fieldset>

          <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
        </div>
        <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar' }}</BotonCasa>
      </form>
    </template>
  </div>
</template>
