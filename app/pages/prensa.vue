<script setup lang="ts">
import { PRENSA, agruparPrensaPorMedio } from '~/data/prensa'

useSeoMeta({
  title: 'Prensa — C.A.S.A.',
  description: 'Entrevistas y apariciones en medios de Fernando Roca Correa sobre cuidado familiar y bienestar de los cuidadores.',
})

const grupos = agruparPrensaPorMedio(PRENSA)

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <section class="p-[30px]">
      <img src="/images/figma/hero-prensa.jpg" alt="Prensa" class="h-[440px] w-full rounded-[30px] object-cover" />
    </section>

    <section
      v-for="grupo in grupos"
      :key="grupo.grupo"
      class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]"
    >
      <h2 class="titulo-seccion">{{ grupo.grupo }}</h2>
      <div class="flex flex-wrap items-stretch gap-[40px]">
        <div v-for="entrada in grupo.entradas" :key="entrada.url" class="flex w-[242px]">
          <VideoCard
            :titulo="entrada.titular"
            :descripcion="(entrada.subtitulo ? entrada.subtitulo + ' · ' : '') + formatearFecha(entrada.fecha)"
            :imagen="entrada.imagen"
            :href="entrada.url"
            texto-boton="Conoce más"
          />
        </div>
      </div>
    </section>
  </div>
</template>
