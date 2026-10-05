<script setup lang="ts">
// Cabezote de las páginas internas. El cliente pidió (30 sep) que fueran más bajos para no
// ocupar todo el pantallazo y que todos llevaran el mismo filtro azul.
defineProps<{ imagen: string; alt: string }>()
</script>

<template>
  <section class="p-[30px]">
    <div class="relative h-[200px] overflow-hidden rounded-[30px] md:h-[260px]">
      <img :src="imagen" :alt="alt" class="size-full object-cover" />
      <div class="pointer-events-none absolute inset-0 bg-[var(--color-terciario)] opacity-40 mix-blend-multiply" />
    </div>
  </section>
</template>
