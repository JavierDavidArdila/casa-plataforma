<script setup lang="ts">
defineProps<{
  nombre: string
  cargo?: string
  descripcion?: string
  href?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-6 text-center">
    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-fondo)] text-[var(--color-texto-suave)]">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    </div>
    <p class="font-semibold text-[var(--color-texto)]">{{ nombre }}</p>
    <p v-if="cargo" class="-mt-2 text-sm italic text-[var(--color-texto-suave)]">{{ cargo }}</p>
    <p v-if="descripcion" class="text-sm text-[var(--color-texto-suave)]">{{ descripcion }}</p>
    <a
      v-if="href"
      :href="href"
      target="_blank"
      rel="noopener"
      class="mt-1 inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white"
    >
      Ver Web ↗
    </a>
  </div>
</template>
