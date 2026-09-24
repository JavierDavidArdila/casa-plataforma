<script setup lang="ts">
useSeoMeta({ title: 'Regístrate — C.A.S.A.' })

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  movil: '',
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
const aQuienAyudasOpciones = ['Mi papá', 'Mi mamá', 'Mis papás', 'Otro familiar', 'Otra persona']
const aniosFueraOpciones = ['Menos de 1 año', '1 a 3 años', '4 a 6 años', '7 a 10 años', 'Más de 10 años']

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
  <div class="flex flex-col items-center gap-[50px] px-[30px] py-[30px]">
    <h1 class="titulo-seccion">Registrarse</h1>

    <form class="flex w-full max-w-[497px] flex-col items-center gap-[50px]" @submit.prevent="enviar">
      <div class="flex w-full flex-col gap-[25px]">
        <input v-model="form.nombre" required placeholder="Nombre*" aria-label="Nombre" class="campo-casa" />
        <input v-model="form.apellido" required placeholder="Apellido*" aria-label="Apellido" class="campo-casa" />
        <input v-model="form.email" type="email" required placeholder="Email*" aria-label="Email" class="campo-casa" />
        <input v-model="form.movil" type="tel" required placeholder="Teléfono*" aria-label="Teléfono" class="campo-casa" />
        <input v-model="form.empresa" placeholder="Empresa" aria-label="Empresa" class="campo-casa" />

        <select v-model="form.paisOrigen" required aria-label="País de origen" class="campo-casa" :class="{ vacio: !form.paisOrigen }">
          <option value="" disabled>País de origen</option>
          <option v-for="pais in paises" :key="pais" :value="pais">{{ pais }}</option>
        </select>
        <select v-model="form.paisResidencia" required aria-label="País de residencia" class="campo-casa" :class="{ vacio: !form.paisResidencia }">
          <option value="" disabled>País de residencia</option>
          <option v-for="pais in paises" :key="pais" :value="pais">{{ pais }}</option>
        </select>
        <select v-model="form.aQuienAyudas" required aria-label="¿A quién ayudas, cuidas o has cuidado a distancia?" class="campo-casa" :class="{ vacio: !form.aQuienAyudas }">
          <option value="" disabled>¿A quién ayudas, cuidas o has cuidado a distancia?</option>
          <option v-for="opcion in aQuienAyudasOpciones" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
        <select v-model="form.haceCuantoVivesFuera" required aria-label="¿Hace cuántos años vives fuera de tu país?" class="campo-casa" :class="{ vacio: !form.haceCuantoVivesFuera }">
          <option value="" disabled>¿Hace cuántos años vives fuera de tu país?</option>
          <option v-for="opcion in aniosFueraOpciones" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>

        <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
      </div>

      <BotonCasa type="submit" :disabled="enviando">{{ enviando ? 'Guardando...' : 'Registrarse' }}</BotonCasa>
    </form>
  </div>
</template>
