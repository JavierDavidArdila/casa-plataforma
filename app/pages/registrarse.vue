<script setup lang="ts">
import {
  ANIOS_1_A_50, CIUDADES_CANADA, CIUDADES_USA, GENEROS, OTRA_CIUDAD, PAISES_ORIGEN, PAISES_RESIDENCIA, PERSONAS_CUIDADAS,
} from '~/data/ubicaciones'
useSeoPagina({
  title: 'Regístrate — C.A.S.A.',
  description: 'Regístrate en la plataforma C.A.S.A. para hacer el Cuestionario de Bienestar y acceder a los contenidos del programa.',
})

const form = reactive({
  nombre: '',
  apellido: '',
  edad: '',
  fechaNacimiento: '',
  genero: '',
  email: '',
  indicativo: '+1',
  movil: '',
  aceptaComunicaciones: false,
  empresa: '',
  paisOrigen: '',
  paisResidencia: '',
  ciudad: '',
  estadoOtro: '',
  ciudadOtra: '',
  paisOtro: '',
  aQuienAyudas: [] as string[],
  haceCuantoVivesFuera: '',
  aniosCuidando: '',
})

const ciudades = computed(() => (form.paisResidencia === 'Canadá' ? CIUDADES_CANADA : CIUDADES_USA))
const pideEstadoYCiudad = computed(() => form.ciudad === OTRA_CIUDAD)
watch(() => form.paisResidencia, () => {
  form.ciudad = ''
})

// Indicativo del teléfono: necesario para poder escribirles por WhatsApp.
const indicativos = [
  { valor: '+1', etiqueta: '+1 EE. UU. y Canadá' },
  { valor: '+57', etiqueta: '+57 Colombia' },
  { valor: '+52', etiqueta: '+52 México' },
  { valor: '+54', etiqueta: '+54 Argentina' },
  { valor: '+591', etiqueta: '+591 Bolivia' },
  { valor: '+55', etiqueta: '+55 Brasil' },
  { valor: '+56', etiqueta: '+56 Chile' },
  { valor: '+506', etiqueta: '+506 Costa Rica' },
  { valor: '+53', etiqueta: '+53 Cuba' },
  { valor: '+593', etiqueta: '+593 Ecuador' },
  { valor: '+503', etiqueta: '+503 El Salvador' },
  { valor: '+34', etiqueta: '+34 España' },
  { valor: '+502', etiqueta: '+502 Guatemala' },
  { valor: '+504', etiqueta: '+504 Honduras' },
  { valor: '+505', etiqueta: '+505 Nicaragua' },
  { valor: '+507', etiqueta: '+507 Panamá' },
  { valor: '+595', etiqueta: '+595 Paraguay' },
  { valor: '+51', etiqueta: '+51 Perú' },
  { valor: '+1787', etiqueta: '+1 Puerto Rico' },
  { valor: '+1809', etiqueta: '+1 Rep. Dominicana' },
  { valor: '+598', etiqueta: '+598 Uruguay' },
  { valor: '+58', etiqueta: '+58 Venezuela' },
]

const enviando = ref(false)
const error = ref<string | null>(null)

function alternarPersona(persona: string) {
  const i = form.aQuienAyudas.indexOf(persona)
  if (i === -1) form.aQuienAyudas.push(persona)
  else form.aQuienAyudas.splice(i, 1)
}

const { registrar } = useEmbudo()

async function enviar() {
  registrar('registro_enviado')
  error.value = null
  if (!form.aQuienAyudas.length) {
    error.value = 'Elige al menos una persona a quien ayudas o cuidas a distancia.'
    return
  }
  enviando.value = true
  try {
    const { indicativo, movil, estadoOtro, ciudadOtra, paisOtro, ciudad, paisResidencia, ...resto } = form
    const numero = movil.replace(/[^\d]/g, '').replace(/^0+/, '')
    // Canadá / EE. UU.: ciudad de la lista o "Estado: Ciudad" digitado. Otro: país y ciudad digitados.
    const esOtroPais = paisResidencia === 'Otro'
    const ciudadFinal = esOtroPais ? ciudadOtra.trim() : ciudad === OTRA_CIUDAD ? `${estadoOtro.trim()}: ${ciudadOtra.trim()}` : ciudad
    await $fetch('/api/lead', {
      method: 'POST',
      body: {
        ...resto,
        movil: `${indicativo} ${numero}`,
        paisResidencia: esOtroPais ? paisOtro.trim() : paisResidencia,
        ciudad: ciudadFinal,
        aQuienAyudas: form.aQuienAyudas.join(', '),
      },
    })
    registrar('registro_ok')
    await navigateTo('/test')
  } catch {
    registrar('registro_error')
    error.value = 'No pudimos guardar tus datos. Revisa el formulario e intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[50px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Registrarse</h1>

    <form class="flex w-full max-w-[497px] flex-col items-center gap-[50px]" @submit.prevent="enviar">
      <div class="flex w-full flex-col gap-[25px]">
        <input v-model="form.nombre" required placeholder="Nombre*" aria-label="Nombre" class="campo-casa" />
        <input v-model="form.apellido" required placeholder="Apellido*" aria-label="Apellido" class="campo-casa" />
        <input v-model="form.edad" type="number" min="1" max="120" inputmode="numeric" required placeholder="Edad* (escribe el número)" aria-label="Edad" class="campo-casa" />
        <label class="flex flex-col gap-[8px]">
          <span class="px-[20px] text-[14px] text-[var(--color-secundario)]">Fecha de nacimiento* (selecciona en el calendario)</span>
          <input v-model="form.fechaNacimiento" type="date" required aria-label="Fecha de nacimiento" class="campo-casa" />
        </label>
        <select v-model="form.genero" required aria-label="Género" class="campo-casa" :class="{ vacio: !form.genero }">
          <option value="" disabled>Género*</option>
          <option v-for="g in GENEROS" :key="g" :value="g">{{ g }}</option>
        </select>
        <input v-model="form.email" type="email" required placeholder="Email*" aria-label="Email" class="campo-casa" />
        <div class="flex gap-[10px]">
          <select v-model="form.indicativo" aria-label="Indicativo del país" class="campo-casa !w-[190px] shrink-0 !pl-[14px] !pr-[36px] !text-[13px]">
            <option v-for="i in indicativos" :key="i.etiqueta" :value="i.valor">{{ i.etiqueta }}</option>
          </select>
          <input v-model="form.movil" type="tel" inputmode="tel" required placeholder="Teléfono móvil*" aria-label="Teléfono móvil (sin indicativo)" class="campo-casa min-w-0 flex-1" />
        </div>
        <input v-model="form.empresa" placeholder="Empresa (opcional)" aria-label="Empresa (opcional)" class="campo-casa" />

        <select v-model="form.paisOrigen" required aria-label="País de origen" class="campo-casa" :class="{ vacio: !form.paisOrigen }">
          <option value="" disabled>País de origen*</option>
          <option v-for="pais in PAISES_ORIGEN" :key="pais" :value="pais">{{ pais }}</option>
        </select>
        <select v-model="form.paisResidencia" required aria-label="País de residencia" class="campo-casa" :class="{ vacio: !form.paisResidencia }">
          <option value="" disabled>País de residencia*</option>
          <option v-for="pais in PAISES_RESIDENCIA" :key="pais" :value="pais">{{ pais === 'Otro' ? 'Otro, cuál' : pais }}</option>
        </select>

        <template v-if="form.paisResidencia === 'Otro'">
          <input v-model="form.paisOtro" required placeholder="País*" aria-label="País de residencia (otro)" class="campo-casa" />
          <input v-model="form.ciudadOtra" required placeholder="Ciudad*" aria-label="Ciudad" class="campo-casa" />
        </template>
        <template v-else-if="form.paisResidencia">
          <select v-model="form.ciudad" required aria-label="Ciudad" class="campo-casa" :class="{ vacio: !form.ciudad }">
            <option value="" disabled>Ciudad*</option>
            <option v-for="c in ciudades" :key="c" :value="c">{{ c }}</option>
            <option :value="OTRA_CIUDAD">Otra, cuál</option>
          </select>
          <template v-if="pideEstadoYCiudad">
            <input v-model="form.estadoOtro" required placeholder="Estado*" aria-label="Estado" class="campo-casa" />
            <input v-model="form.ciudadOtra" required placeholder="Ciudad*" aria-label="Ciudad (otra)" class="campo-casa" />
          </template>
        </template>

        <fieldset class="flex flex-col gap-[10px] px-[20px]">
          <legend class="etiqueta-casa mb-[8px]">¿A quién ayudas, cuidas o has cuidado a distancia?*</legend>
          <label v-for="persona in PERSONAS_CUIDADAS" :key="persona" class="flex cursor-pointer items-center gap-[10px] text-[16px] text-[var(--color-gris-dk)]">
            <input type="checkbox" :checked="form.aQuienAyudas.includes(persona)" class="size-[16px] accent-[var(--color-primario)]" @change="alternarPersona(persona)" />
            {{ persona }}
          </label>
        </fieldset>

        <select v-model="form.haceCuantoVivesFuera" required aria-label="¿Hace cuántos años vives fuera de tu país?" class="campo-casa" :class="{ vacio: !form.haceCuantoVivesFuera }">
          <option value="" disabled>¿Hace cuántos años vives fuera de tu país?*</option>
          <option v-for="n in ANIOS_1_A_50" :key="n" :value="n">{{ n }} {{ n === '1' ? 'año' : 'años' }}</option>
        </select>
        <select v-model="form.aniosCuidando" required aria-label="¿Cuánto tiempo llevas apoyando o cuidando a la distancia?" class="campo-casa" :class="{ vacio: !form.aniosCuidando }">
          <option value="" disabled>¿Cuánto tiempo llevas apoyando o cuidando a la distancia?*</option>
          <option v-for="n in ANIOS_1_A_50" :key="n" :value="n">{{ n }} {{ n === '1' ? 'año' : 'años' }}</option>
        </select>

        <label class="flex items-start gap-[10px] text-[14px] text-[var(--color-gris-dk)]">
          <input v-model="form.aceptaComunicaciones" type="checkbox" class="mt-[3px] size-[16px] shrink-0 accent-[var(--color-primario)]" />
          <span>Acepto envío de información sobre el contenido, publicidad y de aliados de C.A.S.A.</span>
        </label>

        <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      </div>

      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Guardando...' : 'Registrarse' }}</BotonCasa>
    </form>
  </div>
</template>
