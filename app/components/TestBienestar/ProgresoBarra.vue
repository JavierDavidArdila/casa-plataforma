<script setup lang="ts">
defineProps<{
  progreso: number
  pasoActual: number
  totalPasos: number
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="h-2 w-full rounded-full bg-[var(--color-linea)] overflow-hidden">
      <div
        class="h-full rounded-full bg-[var(--color-ocre)] transition-all duration-300"
        :style="{ width: `${progreso}%` }"
      />
    </div>
    <p class="kicker text-[var(--color-tinta-suave)]">
      Pregunta {{ pasoActual + 1 }} de {{ totalPasos }}
    </p>
  </div>
</template>
