<script setup lang="ts">
const items = [
  { grupo: 'Menú', links: [{ to: '/contenidos', label: 'Contenidos', icon: 'videocam' }] },
  {
    grupo: 'Noticias',
    links: [
      { to: '/prensa', label: 'Prensa', icon: 'mic' },
      { to: '/libros', label: 'Libros', icon: 'bookmark' },
    ],
  },
  {
    grupo: 'Nosotros',
    links: [
      { to: '/quienes-somos', label: 'Quiénes Somos', icon: 'mano' },
      { to: '/comuniquemonos', label: 'Comuniquémonos', icon: 'comment' },
    ],
  },
] as const
</script>

<template>
  <aside class="hidden w-[272px] shrink-0 bg-white shadow-[1px_0_0_#e6e6e6] md:block">
    <div class="sticky top-0 flex flex-col items-center py-[30px]">
      <NuxtLink to="/" class="flex w-[272px] flex-col items-center pb-[20px]" aria-label="C.A.S.A. — Del Cuidado a Distancia">
        <img
          src="/images/brand/casa-logo.png"
          alt="C.A.S.A. Del Cuidado a Distancia"
          width="213"
          height="49"
          class="h-[49px] w-[213px] object-contain"
        />
      </NuxtLink>

      <nav class="flex w-full flex-col">
        <div v-for="grupo in items" :key="grupo.grupo" class="flex w-full flex-col">
          <p class="px-[30px] py-[20px] text-[12px] text-[var(--color-gris-md)]">{{ grupo.grupo }}</p>
          <NuxtLink
            v-for="link in grupo.links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-[10px] px-[30px] py-[20px] text-[16px] font-semibold text-[var(--color-gris-md)] transition-colors hover:text-[var(--color-primario)]"
            active-class="!text-[var(--color-gris-dk)]"
          >
            <IconoMenu :nombre="link.icon" />
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>

      <a
        href="https://ahorasoypapademispapas.david-ardila.workers.dev"
        target="_blank"
        rel="noopener"
        class="flex w-full items-center gap-[10px] px-[30px] py-[20px]"
      >
        <img
          src="/images/brand/assp-logo.png"
          alt="¡Ahora soy papá de mis papás!"
          width="50"
          height="50"
          class="size-[50px] shrink-0 object-contain"
        />
        <span class="whitespace-nowrap text-[12px] leading-normal text-[var(--color-gris-md)]">
          Con el respaldo de<br />Ahora Soy Papás de mi Papás
        </span>
      </a>
    </div>
  </aside>
</template>
