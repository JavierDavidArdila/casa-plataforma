<script setup lang="ts">
const redes = [
  { nombre: 'X', href: 'https://x.com', icono: '/images/brand/logo-x.svg' },
  { nombre: 'Facebook', href: 'https://facebook.com', icono: '/images/brand/logo-facebook.svg' },
  { nombre: 'Instagram', href: 'https://instagram.com', icono: '/images/brand/logo-instagram.svg' },
  { nombre: 'LinkedIn', href: 'https://linkedin.com', icono: '/images/brand/logo-linkedin.svg' },
]
</script>

<template>
  <footer class="w-full bg-[var(--color-terciario)] text-white">
    <div class="flex flex-col gap-8 border-t-[5px] border-[var(--color-primario)] p-[50px] sm:min-h-[205px] sm:flex-row sm:items-start sm:justify-between">
      <p class="text-[24px] font-bold leading-none">Contacto</p>
      <div class="flex w-[272px] max-w-full flex-col gap-[15px] text-[12px]">
        <a href="mailto:fernando@ahorasoypapademispapas.com" class="hover:underline">fernando@ahorasoypapademispapas.com</a>
        <a href="https://wa.me/573153350785" target="_blank" rel="noopener" class="flex items-center gap-[5px] hover:underline">
          <img src="/images/brand/logo-whatsapp.svg" alt="" width="10" height="10" class="size-[10px]" />
          +57 315 335 0785
        </a>
      </div>
      <div class="flex w-[272px] max-w-full flex-col gap-[15px] text-[12px]">
        <p class="font-bold text-[var(--color-secundario)]">Legal</p>
        <a href="#" class="hover:underline">Términos y condiciones</a>
        <a href="#" class="hover:underline">Políticas de Privacidad</a>
        <a href="#" class="hover:underline">Políticas de Reembolso</a>
      </div>
    </div>

    <div class="flex flex-col items-center gap-[20px] px-[50px] py-[20px]">
      <div class="flex w-[245px] items-start justify-between">
        <a v-for="red in redes" :key="red.nombre" :href="red.href" target="_blank" rel="noopener" :aria-label="red.nombre">
          <img :src="red.icono" alt="" width="16" height="16" class="size-[16px]" />
        </a>
      </div>
      <p class="text-center text-[16px] leading-none">® Todos los derechos reservados por Cuidar es 360 SAS</p>
    </div>
  </footer>
</template>
