<script setup lang="ts">
// Tarjeta del Figma ("Video Card"): imagen 200px con esquinas superiores de 30px,
// cuerpo blanco con esquinas inferiores de 30px y botón amarillo.
withDefaults(
  defineProps<{
    titulo: string
    descripcion?: string
    imagen?: string
    href?: string
    to?: string
    textoBoton?: string
    bloqueado?: boolean
    /** Sin enlace todavía: el botón se muestra deshabilitado. */
    deshabilitado?: boolean
  }>(),
  { textoBoton: 'Ver video', imagen: '/images/figma/video-card.png' }
)
</script>

<template>
  <div class="flex w-full flex-col items-center">
    <div class="relative h-[200px] w-full">
      <NuxtLink v-if="to" :to="to" class="block size-full" tabindex="-1" aria-hidden="true">
        <img :src="imagen" :alt="titulo" class="size-full rounded-t-[30px] object-cover" loading="lazy" />
      </NuxtLink>
      <a v-else-if="href && !deshabilitado" :href="href" class="block size-full" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
        <img :src="imagen" :alt="titulo" class="size-full rounded-t-[30px] object-cover" loading="lazy" />
      </a>
      <img v-else :src="imagen" :alt="titulo" class="size-full rounded-t-[30px] object-cover" loading="lazy" />
      <span
        v-if="bloqueado"
        class="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white"
      >
        🔒 Solo suscriptores
      </span>
    </div>
    <div class="flex w-full flex-1 flex-col items-start justify-start gap-[15px] rounded-b-[30px] bg-white p-[30px]">
      <p class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">{{ titulo }}</p>
      <p v-if="descripcion" class="text-[16px] leading-none text-[var(--color-gris-dk)] [line-height:1.05]">{{ descripcion }}</p>
      <BotonCasa class="mt-auto" :href="href" :to="to" :disabled="deshabilitado">{{ textoBoton }}</BotonCasa>
    </div>
  </div>
</template>
