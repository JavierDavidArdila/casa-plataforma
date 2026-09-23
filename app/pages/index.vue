<script setup lang="ts">
import { PRENSA } from '~/data/prensa'
import { LIBRO } from '~/data/libro'

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

// Los dos medios más recientes, como vitrina hacia la página completa de Prensa.
const prensaDestacada = PRENSA.slice()
  .sort((a, b) => b.fecha.localeCompare(a.fecha))
  .slice(0, 2)
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
        <NuxtLink v-for="video in videosTemporada1" :key="video.titulo" to="/contenidos" class="block">
          <VideoCard :titulo="video.titulo" :descripcion="video.descripcion" />
        </NuxtLink>
      </div>
    </section>

    <!-- Prensa -->
    <section class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-[var(--color-azul)]">Prensa</h2>
        <NuxtLink to="/prensa" class="text-sm font-medium text-[var(--color-azul)] hover:underline">Ver todo →</NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <VideoCard
          v-for="item in prensaDestacada"
          :key="item.url"
          :titulo="item.medio"
          :descripcion="item.titular"
          :imagen="item.imagen"
          href="/prensa"
          texto-boton="Conoce más"
        />
      </div>
    </section>

    <!-- Libros -->
    <section class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-[var(--color-azul)]">Libros</h2>
        <NuxtLink to="/libros" class="text-sm font-medium text-[var(--color-azul)] hover:underline">Ver todo →</NuxtLink>
      </div>
      <NuxtLink to="/libros" class="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-4">
        <img :src="LIBRO.imagen" :alt="LIBRO.titulo" class="h-28 w-auto rounded-[var(--radius-editorial)] object-contain" loading="lazy" />
        <div class="flex flex-col gap-2">
          <p class="font-semibold">{{ LIBRO.titulo }}</p>
          <p class="text-sm text-[var(--color-texto-suave)]">De {{ LIBRO.autor }}.</p>
          <span class="inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white">
            Conoce más ↗
          </span>
        </div>
      </NuxtLink>
    </section>

    <!-- Quiénes somos -->
    <section class="grid gap-8 md:grid-cols-2 md:items-center">
      <img
        src="/images/bio/home-bio.png"
        alt="Equipo C.A.S.A."
        class="aspect-video w-full rounded-[var(--radius-card)] object-cover md:aspect-auto md:h-full"
        loading="lazy"
      />
      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-bold text-[var(--color-azul)]">Quiénes somos</h2>
        <p class="text-[var(--color-texto-suave)]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus sodales justo, ac suscipit nulla
          aliquam et. Integer ac pharetra magna, id ultricies est
        </p>
        <NuxtLink
          to="/quienes-somos"
          class="inline-flex w-fit items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-naranja-alto)]"
        >
          Conoce más ↗
        </NuxtLink>
      </div>
    </section>

    <!-- Comuniquémonos -->
    <ComuniquemonosForm />
  </div>
</template>
