<script setup lang="ts">
// Íconos rellenos de Material (24px) usados en el menú lateral, como en el Figma.
defineProps<{ nombre: 'videocam' | 'mic' | 'bookmark' | 'mano' | 'comment' }>()
</script>

<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="shrink-0" aria-hidden="true">
    <path v-if="nombre === 'videocam'" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z" />
    <path
      v-else-if="nombre === 'mic'"
      d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7Z"
    />
    <path v-else-if="nombre === 'bookmark'" d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Z" />
    <path
      v-else-if="nombre === 'mano'"
      d="M8 4.5a1.5 1.5 0 0 1 3 0V10h1V3.5a1.5 1.5 0 0 1 3 0V10h1V5.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-.5a7 7 0 0 1-5.3-2.4L3 14.6a1.4 1.4 0 0 1 2-2L7 14.5V6.5a1.5 1.5 0 0 1 1-1.4Z"
    />
    <path
      v-else
      d="M22 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14l4 4V4Zm-4 10H6v-2h12v2Zm0-3H6V9h12v2Zm0-3H6V6h12v2Z"
    />
  </svg>
</template>
