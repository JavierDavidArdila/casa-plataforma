<script setup lang="ts">
const redes = [
  { nombre: 'X', href: 'https://x.com', path: 'M18.9 3H22l-7.6 8.7L23.3 21H16.6l-5.2-6.4L5.4 21H2.3l8.1-9.3L1.4 3h6.9l4.7 5.9L18.9 3Zm-1.2 16.2h1.7L7.4 4.7H5.6l12.1 14.5Z' },
  { nombre: 'Facebook', href: 'https://facebook.com', path: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z' },
  { nombre: 'Instagram', href: 'https://instagram.com', path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm10.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z' },
  { nombre: 'LinkedIn', href: 'https://linkedin.com', path: 'M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.02 2.02 0 1 0 4.75 7a2.02 2.02 0 0 0 0-4ZM21 21v-7c0-3.3-1.8-5-4.4-5-1.5 0-2.6.7-3.1 1.6V9H10v12h3.5v-6.5c0-1.2.7-2.2 1.9-2.2s1.8 1 1.8 2.2V21H21Z' },
]
</script>

<template>
  <footer class="w-full">
    <div class="flex flex-col gap-8 border-t-4 border-[var(--color-naranja)] bg-[var(--color-azul-alto)] px-6 py-8 text-white sm:flex-row sm:items-start sm:justify-between md:px-10">
      <p class="text-xl font-bold">Contacto</p>
      <div class="flex flex-col gap-3 text-sm">
        <a href="mailto:fernando@ahorasoypapademispapas.com" class="hover:underline">fernando@ahorasoypapademispapas.com</a>
        <a href="tel:+573153350785" class="flex items-center gap-2 hover:underline">
          <IconoNav nombre="mic" />
          +57 315 335 0785
        </a>
      </div>
      <div class="flex flex-col gap-3 text-sm">
        <p class="font-bold text-[var(--color-naranja)]">Legal</p>
        <a href="#" class="hover:underline">Términos y condiciones</a>
        <a href="#" class="hover:underline">Políticas de Privacidad</a>
        <a href="#" class="hover:underline">Políticas de Reembolso</a>
      </div>
    </div>

    <div class="flex flex-col items-center gap-5 bg-[var(--color-azul-alto)] px-6 py-5 md:px-10">
      <div class="flex items-center gap-6">
        <a v-for="red in redes" :key="red.nombre" :href="red.href" target="_blank" rel="noopener" :aria-label="red.nombre" class="text-white/90 hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path :d="red.path" /></svg>
        </a>
      </div>
      <p class="text-center text-sm text-white">® Todos los derechos reservados por Cuidar es 360 SAS</p>
    </div>
  </footer>
</template>
