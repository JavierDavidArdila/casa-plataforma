<script setup lang="ts">
withDefaults(
  defineProps<{
    titulo: string
    imagen?: string
    intro?: string
    bullets?: string[]
    cierre?: string
    comprarHref?: string
    disponible?: boolean
  }>(),
  { disponible: true }
)
</script>

<template>
  <div class="flex flex-col gap-5 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-6 sm:flex-row">
    <div class="relative shrink-0 self-center sm:self-start">
      <img v-if="imagen" :src="imagen" :alt="titulo" class="h-52 w-auto rounded-[var(--radius-editorial)] object-contain" loading="lazy" />
      <ImagenPlaceholder v-else aspecto="aspect-[3/4] w-36" :etiqueta="titulo" />
      <span
        v-if="!disponible"
        class="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-[var(--color-azul)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
      >
        Próximamente
      </span>
    </div>

    <div class="flex flex-1 flex-col justify-between gap-4">
      <div class="flex flex-col gap-3 text-sm text-[var(--color-texto-suave)]">
        <p class="text-xl font-bold text-[var(--color-azul)]">{{ titulo }}</p>
        <p v-if="intro">{{ intro }}</p>
        <ul v-if="bullets?.length" class="list-disc pl-5">
          <li v-for="item in bullets" :key="item">{{ item }}</li>
        </ul>
        <p v-if="cierre">{{ cierre }}</p>
      </div>

      <a
        v-if="disponible && comprarHref"
        :href="comprarHref"
        class="inline-flex w-fit items-center gap-2 rounded-[10px] bg-[var(--color-naranja)] px-6 py-3 text-sm font-bold text-white"
      >
        Comprar libro ↗
      </a>
      <span
        v-else
        class="inline-flex w-fit items-center gap-2 rounded-[10px] bg-[var(--color-borde)] px-6 py-3 text-sm font-bold text-[var(--color-texto-suave)]"
      >
        Próximamente
      </span>
    </div>
  </div>
</template>
