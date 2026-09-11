<script setup lang="ts">
import type { PreguntaTest } from '~/data/test-bienestar'

const props = defineProps<{
  pregunta: PreguntaTest
  valor: string | number | string[] | undefined
}>()

const emit = defineEmits<{
  responder: [valor: string | number | string[]]
}>()

function elegirUnica(valor: string | number) {
  emit('responder', valor)
}

function alternarMultiple(valor: string) {
  const actuales = Array.isArray(props.valor) ? [...props.valor] : []
  const idx = actuales.indexOf(valor)
  if (idx >= 0) actuales.splice(idx, 1)
  else actuales.push(valor)
  emit('responder', actuales)
}

function estaSeleccionada(opcionValor: string | number) {
  if (props.pregunta.tipo === 'seleccion-multiple') {
    return Array.isArray(props.valor) && props.valor.includes(opcionValor as string)
  }
  return props.valor === opcionValor
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-tinta)]">
      {{ pregunta.texto }}
    </h2>

    <div
      class="grid gap-3"
      :class="pregunta.tipo === 'escala-0-4' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'"
    >
      <button
        v-for="opcion in pregunta.opciones"
        :key="opcion.valor"
        type="button"
        class="text-left rounded-[var(--radius-editorial)] border-2 px-5 py-4 transition-colors duration-150"
        :class="
          estaSeleccionada(opcion.valor)
            ? 'border-[var(--color-ocre)] bg-[var(--color-ocre)]/10 text-[var(--color-tinta)]'
            : 'border-[var(--color-linea)] hover:border-[var(--color-ocre)]'
        "
        @click="
          pregunta.tipo === 'seleccion-multiple'
            ? alternarMultiple(opcion.valor as string)
            : elegirUnica(opcion.valor)
        "
      >
        {{ opcion.etiqueta }}
      </button>
    </div>
  </div>
</template>
