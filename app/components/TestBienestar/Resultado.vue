<script setup lang="ts">
import { PILARES } from '~/data/test-bienestar'
import type { ResultadoTest } from '~/composables/useTestBienestar'

defineProps<{
  resultado: ResultadoTest
}>()

const emit = defineEmits<{
  reiniciar: []
}>()
</script>

<template>
  <div class="flex flex-col gap-6 text-center items-center max-w-xl mx-auto">
    <p class="kicker text-[var(--color-tinta-suave)]">Tu resultado</p>

    <p class="text-5xl font-bold text-[var(--color-terracota)]">
      {{ resultado.puntajeIecd }}<span class="text-2xl text-[var(--color-tinta-suave)]">/44</span>
    </p>

    <h2 class="text-3xl font-bold">{{ resultado.franja.resultado }}</h2>
    <p class="text-[var(--color-tinta-suave)]">{{ resultado.franja.interpretacion }}</p>

    <div v-if="resultado.pilarPrincipal" class="mt-4 rounded-[var(--radius-editorial)] bg-[var(--color-papel-alto)] p-6">
      <p class="kicker text-[var(--color-tinta-suave)] mb-1">Tu principal área de atención</p>
      <p class="text-xl font-bold text-[var(--color-salvia-alto)]">
        {{ PILARES[resultado.pilarPrincipal].nombre }}
      </p>
      <p class="text-sm text-[var(--color-tinta-suave)] mt-1">
        {{ PILARES[resultado.pilarPrincipal].descripcion }}
      </p>
    </div>

    <div class="mt-6 flex w-full flex-col items-center gap-4 rounded-[var(--radius-editorial)] border border-[var(--color-linea)] p-6">
      <p class="font-semibold">¿Quieres entrar a la plataforma y ver los contenidos para tu área de atención?</p>
      <div class="flex gap-3">
        <NuxtLink
          to="/crear-cuenta"
          class="rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-2.5 font-medium text-white"
        >
          Sí, quiero entrar
        </NuxtLink>
        <NuxtLink
          to="/"
          class="rounded-[var(--radius-editorial)] border border-[var(--color-linea)] px-6 py-2.5 font-medium text-[var(--color-tinta-suave)]"
        >
          No, por ahora no
        </NuxtLink>
      </div>
    </div>

    <button
      type="button"
      class="mt-2 text-sm underline text-[var(--color-tinta-suave)]"
      @click="emit('reiniciar')"
    >
      Volver a hacer el test
    </button>
  </div>
</template>
