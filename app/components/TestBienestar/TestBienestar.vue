<script setup lang="ts">
const {
  preguntaActual,
  respuestas,
  progreso,
  pasoActual,
  totalPasos,
  esUltimaPregunta,
  enviado,
  enviando,
  errorEnvio,
  responder,
  siguiente,
  anterior,
  calcularResultado,
  enviarResultado,
  reiniciar,
} = useTestBienestar()

const resultado = computed(() => calcularResultado())

const respuestaActual = computed(() => respuestas.value[preguntaActual.value.id])
const puedeAvanzar = computed(() => {
  const valor = respuestaActual.value
  if (Array.isArray(valor)) return valor.length > 0
  return valor !== undefined && valor !== null && valor !== ''
})

async function manejarSiguiente() {
  if (esUltimaPregunta.value) {
    await enviarResultado()
  } else {
    siguiente()
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16 md:py-20">
    <div v-if="!enviado" class="flex flex-col gap-10">
      <TestBienestarProgresoBarra :progreso="progreso" :paso-actual="pasoActual" :total-pasos="totalPasos" />

      <TestBienestarPregunta
        :pregunta="preguntaActual"
        :valor="respuestaActual"
        @responder="(v) => responder(preguntaActual.id, v)"
      />

      <div class="flex justify-between items-center">
        <button
          type="button"
          class="text-sm text-[var(--color-tinta-suave)] disabled:opacity-0"
          :disabled="pasoActual === 0"
          @click="anterior"
        >
          ← Anterior
        </button>

        <button
          type="button"
          :disabled="!puedeAvanzar || enviando"
          class="inline-flex items-center gap-2 rounded-[var(--radius-editorial)] px-6 py-3 font-medium transition-colors duration-150 bg-[var(--color-ocre)] text-[var(--color-tinta)] hover:bg-[var(--color-amarillo-alto)] disabled:opacity-40 disabled:pointer-events-none"
          @click="manejarSiguiente"
        >
          {{ enviando ? 'Guardando...' : esUltimaPregunta ? 'Ver mi resultado' : 'Siguiente' }}
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col gap-4">
      <p v-if="errorEnvio" class="text-sm text-center text-[var(--color-terracota)]">{{ errorEnvio }}</p>
      <TestBienestarResultado :resultado="resultado" @reiniciar="reiniciar" />
    </div>
  </div>
</template>
