<script setup lang="ts">
import { LIBRO, TIENDAS_COLOMBIA, TIENDAS_FUERA_COLOMBIA, TIENDAS_EBOOK } from '~/data/libro'

useSeoMeta({
  title: 'Libros — C.A.S.A.',
  description: LIBRO.intro,
})
</script>

<template>
  <div class="flex flex-col gap-10 px-6 py-10 md:px-10">
    <section class="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-10 text-white">
      <div class="absolute inset-0 bg-[var(--color-azul-alto)]" />
      <div class="relative flex flex-col gap-2">
        <h1 class="text-3xl font-bold text-[var(--color-naranja)] md:text-4xl">Libros</h1>
        <p class="text-sm text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <LibroCard
        :titulo="LIBRO.titulo"
        :imagen="LIBRO.imagen"
        :intro="LIBRO.intro"
        :bullets="LIBRO.bullets"
        :cierre="LIBRO.cierre"
        :comprar-href="LIBRO.comprarHref"
      />
      <LibroCard titulo="Próximo libro" :disponible="false" intro="Estamos preparando un nuevo título — muy pronto más detalles." />
    </div>

    <section class="flex flex-col gap-10 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-8">
      <div class="grid gap-10 md:grid-cols-2">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="font-bold text-[var(--color-azul)]">En Colombia:</h2>
          <p class="text-sm text-[var(--color-texto-suave)]">
            ¡Ahora soy papá de mis papás! está en las principales cadenas de librerías de Colombia, así como en
            los puntos Brit de los aeropuertos y en la mayoría de las librerías independientes desde la costa
            norte hasta Nariño y desde el Valle hasta Boyacá.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-8">
            <component
              :is="tienda.url ? 'a' : 'span'"
              v-for="tienda in TIENDAS_COLOMBIA"
              :key="tienda.nombre"
              :href="tienda.url || undefined"
              target="_blank"
              rel="noopener"
            >
              <img :src="tienda.logo" :alt="tienda.nombre" class="max-h-12 w-auto object-contain" />
            </component>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="font-bold text-[var(--color-azul)]">Fuera de Colombia:</h2>
          <p class="text-sm text-[var(--color-texto-suave)]">
            En Ecuador está disponible en LibriMundi, Librería Española y Mr. Books, y en toda la región a través
            de Buscalibre.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-8">
            <component
              :is="tienda.url ? 'a' : 'span'"
              v-for="tienda in TIENDAS_FUERA_COLOMBIA"
              :key="tienda.nombre"
              :href="tienda.url || undefined"
              target="_blank"
              rel="noopener"
            >
              <img :src="tienda.logo" :alt="tienda.nombre" class="max-h-12 w-auto object-contain" />
            </component>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 border-t border-[var(--color-borde)] pt-8 text-center">
        <p class="font-bold text-[var(--color-azul)]">En versión E-Book se encuentra en Amazon, Apple y Google a nivel mundial.</p>
        <div class="flex flex-wrap items-center justify-center gap-10">
          <component
            :is="tienda.url ? 'a' : 'span'"
            v-for="tienda in TIENDAS_EBOOK"
            :key="tienda.nombre"
            :href="tienda.url || undefined"
            target="_blank"
            rel="noopener"
          >
            <img :src="tienda.logo" :alt="tienda.nombre" class="max-h-12 w-auto object-contain" />
          </component>
        </div>
      </div>
    </section>
  </div>
</template>
