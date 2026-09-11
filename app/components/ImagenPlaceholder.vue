<script setup lang="ts">
withDefaults(defineProps<{ etiqueta?: string; aspecto?: string }>(), {
  etiqueta: '',
  aspecto: 'aspect-video',
})
</script>

<template>
  <div
    :class="aspecto"
    class="flex items-center justify-center rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--color-azul)]/10 to-[var(--color-naranja)]/20 text-center text-xs text-[var(--color-texto-suave)]"
  >
    <span v-if="etiqueta" class="px-3">{{ etiqueta }}</span>
  </div>
</template>
