<script setup lang="ts">
// Botón amarillo del Figma: 30×15 de padding, radio 10, texto blanco 14px bold + flecha ↗.
const props = defineProps<{ to?: string; href?: string; type?: 'button' | 'submit'; disabled?: boolean; sinFlecha?: boolean }>()

const etiqueta = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="etiqueta"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener' : undefined"
    :type="!to && !href ? (type ?? 'button') : undefined"
    :disabled="!to && !href ? disabled : undefined"
    class="inline-flex w-fit items-center justify-center gap-[10px] rounded-[10px] bg-[var(--color-primario)] px-[30px] py-[15px] text-[14px] font-bold leading-none text-white transition-colors hover:bg-[var(--color-primario-alto)] disabled:cursor-not-allowed disabled:opacity-60"
  >
    <slot />
    <svg v-if="!sinFlecha" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  </component>
</template>
