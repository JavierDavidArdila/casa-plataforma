<script setup lang="ts">
defineProps<{
  nombre: 'video' | 'mic' | 'book' | 'mano' | 'chat' | 'persona' | 'casa' | 'buscar' | 'play'
}>()
</script>

<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="shrink-0"
  >
    <template v-if="nombre === 'video'">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="M15.5 10.5 21 7v10l-5.5-3.5Z" />
    </template>
    <template v-else-if="nombre === 'mic'">
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
      <path d="M8.5 21h7" />
    </template>
    <template v-else-if="nombre === 'book'">
      <path d="M4 4.5c2.5-1 5.5-1 8 0v15c-2.5-1-5.5-1-8 0Z" />
      <path d="M20 4.5c-2.5-1-5.5-1-8 0v15c2.5-1 5.5-1 8 0Z" />
    </template>
    <template v-else-if="nombre === 'mano'">
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M11 12V4a1.5 1.5 0 0 1 3 0v8" />
      <path d="M14 12V5.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M8 13.5 6.7 12a1.4 1.4 0 0 0-2 2l3.7 4.3A5 5 0 0 0 12.2 20H14a5 5 0 0 0 5-5v-3.5" />
    </template>
    <template v-else-if="nombre === 'chat'">
      <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" />
    </template>
    <template v-else-if="nombre === 'persona'">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </template>
    <template v-else-if="nombre === 'casa'">
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
    </template>
    <template v-else-if="nombre === 'buscar'">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.5-4.5" />
    </template>
    <template v-else-if="nombre === 'play'">
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8.5 6 3.5-6 3.5Z" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>
