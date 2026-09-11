<script setup lang="ts">
useSeoMeta({
  title: 'C.A.S.A. — Del Cuidado a Distancia',
  description: 'Plataforma C.A.S.A.: test de bienestar, contenidos y acompañamiento para quienes cuidan a distancia.',
})

const videosTemporada1 = [
  { titulo: 'Video Comprender', descripcion: 'Culpa, sensación de insuficiencia, aceptación del nuevo rol.' },
  { titulo: 'Video Acompañar', descripcion: 'Comunicación, tensión emocional, calidad del vínculo.' },
  { titulo: 'Video Sostener', descripcion: 'Dependencia excesiva, red familiar, organización del cuidado.' },
  { titulo: 'Video Aliviar', descripcion: 'Sobrecarga general, equilibrio entre cuidado y vida propia.' },
]
</script>

<template>
  <div class="flex flex-col gap-16 px-6 py-10 md:px-10">
    <!-- Hero -->
    <section class="grid gap-8 md:grid-cols-2 md:items-center">
      <div class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold text-[var(--color-azul)] md:text-4xl">Bienvenido a C.A.S.A.</h1>
        <p class="max-w-md text-[var(--color-texto-suave)]">
          Un espacio para quienes cuidan y apoyan a su familia a la distancia: empieza con un test breve para saber
          en qué necesitas más apoyo, y accede después a contenidos pensados para cada etapa del cuidado.
        </p>
        <NuxtLink
          to="/registrarse"
          class="inline-flex w-fit items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-naranja-alto)]"
        >
          Hacer test de bienestar ↗
        </NuxtLink>
      </div>

      <div class="relative overflow-hidden rounded-[var(--radius-card)]">
        <ImagenPlaceholder aspecto="aspect-[4/3]" etiqueta="Video introductorio (pendiente)" />
        <button
          type="button"
          aria-label="Reproducir video introductorio"
          class="absolute inset-0 flex items-center justify-center"
        >
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--color-azul)] shadow-lg">
            <IconoNav nombre="play" />
          </span>
        </button>
      </div>
    </section>

    <!-- Primera temporada -->
    <section class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-[var(--color-azul)]">Primera temporada</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="video in videosTemporada1"
          :key="video.titulo"
          to="/contenidos"
          class="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-3 transition-shadow hover:shadow-md"
        >
          <ImagenPlaceholder :etiqueta="video.titulo" />
          <div>
            <p class="font-semibold">{{ video.titulo }}</p>
            <p class="text-sm text-[var(--color-texto-suave)]">{{ video.descripcion }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Prensa -->
    <section class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-[var(--color-azul)]">Prensa</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <a
          v-for="item in [{ medio: 'TV', href: 'https://ahorasoypapademispapas.david-ardila.workers.dev/prensa' }, { medio: 'Radio', href: 'https://ahorasoypapademispapas.david-ardila.workers.dev/prensa' }]"
          :key="item.medio"
          :href="item.href"
          target="_blank"
          rel="noopener"
          class="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-4"
        >
          <ImagenPlaceholder :etiqueta="`Prensa — ${item.medio}`" />
          <div>
            <p class="font-semibold">{{ item.medio }}</p>
            <p class="text-sm text-[var(--color-texto-suave)]">Entrevistas y apariciones en {{ item.medio }}.</p>
          </div>
          <span class="inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white">
            Conoce más ↗
          </span>
        </a>
      </div>
    </section>

    <!-- Libros -->
    <section class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-[var(--color-azul)]">Libros</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <a
          v-for="n in [1, 2]"
          :key="n"
          href="https://ahorasoypapademispapas.david-ardila.workers.dev/libro"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-4"
        >
          <ImagenPlaceholder aspecto="aspect-[3/4] w-28" :etiqueta="`Libro 0${n}`" />
          <div class="flex flex-col gap-2">
            <p class="font-semibold">Libro 0{{ n }}</p>
            <p class="text-sm text-[var(--color-texto-suave)]">"¡Ahora soy papá de mis papás!", de Fernando Roca Correa.</p>
            <span class="inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white">
              Conoce más ↗
            </span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
