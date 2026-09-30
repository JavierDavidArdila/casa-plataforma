<script setup lang="ts">
import { LIBRO, TIENDAS_COLOMBIA, TIENDAS_LATINOAMERICA, TIENDAS_USA, TEXTO_USA, TIENDAS_EBOOK } from '~/data/libro'

useSeoMeta({
  title: 'Libros — C.A.S.A.',
  description: LIBRO.intro,
})

// Figma: dos filas en zigzag — imagen del libro en tarjeta blanca (509×419) y texto + botón al lado.
const libros = [
  { titulo: 'Colombia y Latinoamérica', imagen: '/images/libros/colombia-latinoamerica.jpg', invertido: false },
  { titulo: 'Estados Unidos y Canadá', imagen: '/images/libros/estados-unidos-canada.jpg', invertido: true },
]
</script>

<template>
  <div>
    <section class="p-[30px]">
      <img src="/images/figma/hero-libros.jpg" alt="Libros" class="h-[440px] w-full rounded-[30px] object-cover" />
    </section>

    <section class="flex flex-col gap-[60px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <div
        v-for="libro in libros"
        :key="libro.titulo"
        class="grid items-center gap-[40px] lg:grid-cols-2"
      >
        <div class="flex h-[419px] items-center justify-center overflow-hidden rounded-[30px] bg-white" :class="libro.invertido ? 'lg:order-2' : ''">
          <img
            :src="libro.imagen"
            :alt="libro.titulo"
            class="size-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col items-start gap-[15px]" :class="libro.invertido ? 'lg:order-1' : ''">
          <h2 class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">{{ libro.titulo }}</h2>
          <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.2]">
            {{ LIBRO.intro }}
            <template v-for="(item, i) in LIBRO.bullets" :key="item">{{ item }}{{ i < LIBRO.bullets.length - 1 ? ' · ' : '.' }}</template>
            {{ LIBRO.cierre }}
          </p>
          <BotonCasa :href="LIBRO.comprarHref">Comprar libro</BotonCasa>
        </div>
      </div>
    </section>

    <section class="border-t border-[#dcdcdc] px-[30px] py-[50px]">
     <div class="flex flex-col gap-[40px] rounded-[30px] bg-[var(--color-terciario)] p-[50px] text-white">
      <div class="grid gap-[40px] md:grid-cols-2">
        <div class="flex flex-col items-center gap-[15px] text-center">
          <h2 class="text-[24px] font-bold leading-none text-[var(--color-primario)]">Colombia y Latinoamérica:</h2>
          <p class="text-[16px]">
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
          <p class="mt-[15px] text-[16px]">
            En Ecuador está disponible en LibriMundi, Librería Española y Mr. Books, y en toda la región a través
            de Buscalibre.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-8">
            <component
              :is="tienda.url ? 'a' : 'span'"
              v-for="tienda in TIENDAS_LATINOAMERICA"
              :key="tienda.nombre"
              :href="tienda.url || undefined"
              target="_blank"
              rel="noopener"
            >
              <img :src="tienda.logo" :alt="tienda.nombre" class="max-h-12 w-auto object-contain" />
            </component>
          </div>
        </div>

        <div class="flex flex-col items-center gap-[15px] text-center">
          <h2 class="text-[24px] font-bold leading-none text-[var(--color-primario)]">Estados Unidos y Canadá:</h2>
          <p v-if="TEXTO_USA" class="text-[16px]">{{ TEXTO_USA }}</p>
          <div class="flex flex-wrap items-center justify-center gap-8">
            <component
              :is="tienda.url ? 'a' : 'span'"
              v-for="tienda in TIENDAS_USA"
              :key="tienda.nombre"
              :href="tienda.url || undefined"
              target="_blank"
              rel="noopener"
            >
              <img :src="tienda.logo" :alt="tienda.nombre" class="max-h-10 w-auto max-w-[150px] object-contain" />
            </component>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-[15px] border-t border-white/20 pt-[40px] text-center">
        <p class="text-[16px] font-bold text-white">
          En versión E-Book se encuentra en Amazon, Apple y Google a nivel mundial.
        </p>
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
     </div>
    </section>
  </div>
</template>
