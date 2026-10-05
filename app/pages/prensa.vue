<script setup lang="ts">
import { PRENSA, PRENSA_INTRO } from '~/data/prensa'

useSeoPagina({
  title: 'Prensa — C.A.S.A.',
  imagen: '/images/figma/hero-prensa.jpg',
  description: PRENSA_INTRO,
})
</script>

<template>
  <div>
    <HeroCasa imagen="/images/figma/hero-prensa.jpg" alt="Prensa" />

    <section class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <h1 class="titulo-seccion">Prensa</h1>
      <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.2]">{{ PRENSA_INTRO }}</p>
      <div class="flex flex-wrap items-stretch gap-[40px]">
        <div v-for="entrada in PRENSA" :key="entrada.titulo" class="flex w-[300px]">
          <VideoCard
            :titulo="entrada.titulo"
            :descripcion="entrada.descripcion"
            :imagen="entrada.imagen"
            :href="entrada.url"
            :deshabilitado="!entrada.url"
            :texto-boton="entrada.url ? 'Conoce más' : 'Próximamente'"
          />
        </div>
      </div>
    </section>
  </div>
</template>
