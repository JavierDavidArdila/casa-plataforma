<script setup lang="ts">
const ASPP = 'https://ahorasoypapademispapas.david-ardila.workers.dev'

// Contenidos vive en esta plataforma; Prensa/Libros/Quiénes somos/Comuniquémonos
// ya existen, bien construidos, en el sitio principal — en vez de duplicarlos
// a medio hacer aquí, se enlaza directo allá (mantiene la "cercanía" de marca).
const items = [
  { grupo: 'Menú', links: [{ to: '/contenidos', label: 'Contenidos', icon: 'video', externo: false }] },
  {
    grupo: 'Noticias',
    links: [
      { to: `${ASPP}/prensa`, label: 'Prensa', icon: 'mic', externo: true },
      { to: `${ASPP}/libro`, label: 'Libros', icon: 'book', externo: true },
    ],
  },
  {
    grupo: 'Nosotros',
    links: [
      { to: `${ASPP}/biografia`, label: 'Quiénes Somos', icon: 'mano', externo: true },
      { to: `${ASPP}/contacto`, label: 'Comuniquémonos', icon: 'chat', externo: true },
    ],
  },
]
</script>

<template>
  <aside
    class="hidden md:flex w-56 shrink-0 flex-col justify-between bg-[var(--color-superficie)] border-r border-[var(--color-borde)] px-5 py-6"
  >
    <div class="flex flex-col gap-8">
      <NuxtLink to="/" class="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C9 6 6 7 3 7c0 7 4 11 9 14 5-3 9-7 9-14-3 0-6-1-9-4Z"
            fill="var(--color-naranja)"
          />
        </svg>
        <span class="leading-none">
          <span class="block font-bold text-lg text-[var(--color-azul)]">C.A.S.A.</span>
          <span class="block text-[10px] tracking-wide text-[var(--color-texto-suave)]">Del Cuidado a Distancia</span>
        </span>
      </NuxtLink>

      <nav class="flex flex-col gap-6">
        <div v-for="grupo in items" :key="grupo.grupo" class="flex flex-col gap-2">
          <p class="kicker text-[var(--color-texto-suave)]">{{ grupo.grupo }}</p>
          <template v-for="link in grupo.links" :key="link.to">
            <a
              v-if="link.externo"
              :href="link.to"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-3 rounded-[var(--radius-editorial)] px-2 py-2 text-sm text-[var(--color-texto)] hover:bg-[var(--color-fondo)]"
            >
              <IconoNav :nombre="link.icon" />
              {{ link.label }}
            </a>
            <NuxtLink
              v-else
              :to="link.to"
              class="flex items-center gap-3 rounded-[var(--radius-editorial)] px-2 py-2 text-sm text-[var(--color-texto)] hover:bg-[var(--color-fondo)]"
              active-class="text-[var(--color-azul)] font-medium"
            >
              <IconoNav :nombre="link.icon" />
              {{ link.label }}
            </NuxtLink>
          </template>
        </div>
      </nav>
    </div>

    <a
      href="https://ahorasoypapademispapas.david-ardila.workers.dev"
      target="_blank"
      rel="noopener"
      class="flex items-center gap-3 rounded-[var(--radius-editorial)] border border-[var(--color-borde)] p-3"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-azul)] text-center text-[9px] font-bold leading-tight text-white"
      >
        ¡Ahora soy papá de mis papás!
      </span>
      <span class="text-[11px] text-[var(--color-texto-suave)]">Con el respaldo de Ahora Soy Papás de mis Papás</span>
    </a>
  </aside>
</template>
