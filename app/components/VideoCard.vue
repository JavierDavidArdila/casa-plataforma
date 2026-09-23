<script setup lang="ts">
withDefaults(
  defineProps<{
    titulo: string
    descripcion?: string
    etiqueta?: string
    imagen?: string
    href?: string
    textoBoton?: string
    bloqueado?: boolean
  }>(),
  { textoBoton: 'Ver video' }
)
</script>

<template>
  <div class="flex w-full flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-3">
    <div class="relative">
      <img v-if="imagen" :src="imagen" :alt="titulo" class="aspect-[4/3] w-full rounded-[var(--radius-editorial)] object-cover" loading="lazy" />
      <ImagenPlaceholder v-else aspecto="aspect-[4/3]" :etiqueta="etiqueta ?? titulo" />
      <span
        v-if="bloqueado"
        class="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white"
      >
        🔒 Solo suscriptores
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-1">
      <p class="font-semibold text-[var(--color-texto)]">{{ titulo }}</p>
      <p v-if="descripcion" class="text-sm text-[var(--color-texto-suave)]">{{ descripcion }}</p>
    </div>
    <component
      :is="href ? 'a' : 'span'"
      :href="href"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener' : undefined"
      class="inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white"
    >
      {{ textoBoton }} ↗
    </component>
  </div>
</template>
