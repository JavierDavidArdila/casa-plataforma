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
    <svg v-if="!sinFlecha" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.66666 11.3334L11.3333 4.66669M11.3333 11.3334V4.66669H4.66666" />
    </svg>
  </component>
</template>
