<script setup lang="ts">
defineProps<{
  nombre: string
  cargo?: string
  foto?: string
  descripcion?: string
  href?: string
}>()
</script>

<template>
  <div class="flex min-h-[370px] flex-col items-center gap-[15px] rounded-[30px] bg-white p-[30px] text-center">
    <img v-if="foto" :src="foto" :alt="nombre" class="size-[100px] rounded-full object-cover" loading="lazy" />
    <div v-else class="flex size-[100px] items-center justify-center rounded-full bg-[var(--color-fondo)] text-[var(--color-gris-md)]">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    </div>
    <p class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">{{ nombre }}</p>
    <p v-if="cargo" class="text-[16px] leading-none text-[var(--color-secundario)]">{{ cargo }}</p>
    <p v-if="descripcion" class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.05]">{{ descripcion }}</p>
    <BotonCasa v-if="href" :href="href" class="mt-auto">Ver Web</BotonCasa>
  </div>
</template>
