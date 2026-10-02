<script setup lang="ts">
useSeoPagina({
  title: 'Regístrate — C.A.S.A.',
  description: 'Regístrate en la plataforma C.A.S.A. para hacer el Cuestionario de Bienestar y acceder a los contenidos del programa.',
})

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  indicativo: '+1',
  movil: '',
  aceptaComunicaciones: false,
  empresa: '',
  paisOrigen: '',
  paisResidencia: '',
  aQuienAyudas: '',
  haceCuantoVivesFuera: '',
})

const paises = [
  'Argentina', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador',
  'España', 'Estados Unidos', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela', 'Otro',
]
// La plataforma es para quienes viven en Estados Unidos o Canadá.
const paisesResidencia = ['Estados Unidos', 'Canadá']
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
const aQuienAyudasOpciones = ['Mi papá', 'Mi mamá', 'Mis papás', 'Otro familiar', 'Otra persona']
const aniosFueraOpciones = ['Menos de 1 año', '1 a 3 años', '4 a 6 años', '7 a 10 años', 'Más de 10 años']

const enviando = ref(false)
const error = ref<string | null>(null)

async function enviar() {
  enviando.value = true
  error.value = null
  try {
    const { indicativo, movil, ...resto } = form
    const numero = movil.replace(/[^\d]/g, '').replace(/^0+/, '')
    await $fetch('/api/lead', { method: 'POST', body: { ...resto, movil: `${indicativo} ${numero}` } })
    await navigateTo('/test')
  } catch {
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
        <input v-model="form.email" type="email" required placeholder="Email*" aria-label="Email" class="campo-casa" />
        <div class="flex gap-[10px]">
          <select v-model="form.indicativo" aria-label="Indicativo del país" class="campo-casa !w-[190px] shrink-0 !pl-[14px] !pr-[36px] !text-[13px]">
            <option v-for="i in indicativos" :key="i.etiqueta" :value="i.valor">{{ i.etiqueta }}</option>
          </select>
          <input v-model="form.movil" type="tel" inputmode="tel" required placeholder="Teléfono*" aria-label="Teléfono (sin indicativo)" class="campo-casa min-w-0 flex-1" />
        </div>
        <input v-model="form.empresa" placeholder="Empresa" aria-label="Empresa" class="campo-casa" />

        <select v-model="form.paisOrigen" required aria-label="País de origen" class="campo-casa" :class="{ vacio: !form.paisOrigen }">
          <option value="" disabled>País de origen</option>
          <option v-for="pais in paises" :key="pais" :value="pais">{{ pais }}</option>
        </select>
        <select v-model="form.paisResidencia" required aria-label="País de residencia" class="campo-casa" :class="{ vacio: !form.paisResidencia }">
          <option value="" disabled>País de residencia</option>
          <option v-for="pais in paisesResidencia" :key="pais" :value="pais">{{ pais }}</option>
        </select>
        <select v-model="form.aQuienAyudas" required aria-label="¿A quién ayudas, cuidas o has cuidado a distancia?" class="campo-casa" :class="{ vacio: !form.aQuienAyudas }">
          <option value="" disabled>¿A quién ayudas, cuidas o has cuidado a distancia?</option>
          <option v-for="opcion in aQuienAyudasOpciones" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
        <select v-model="form.haceCuantoVivesFuera" required aria-label="¿Hace cuántos años vives fuera de tu país?" class="campo-casa" :class="{ vacio: !form.haceCuantoVivesFuera }">
          <option value="" disabled>¿Hace cuántos años vives fuera de tu país?</option>
          <option v-for="opcion in aniosFueraOpciones" :key="opcion" :value="opcion">{{ opcion }}</option>
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
