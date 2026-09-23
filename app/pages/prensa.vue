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
  <div class="flex flex-col gap-10 px-6 py-10 md:px-10">
    <section class="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-10 text-white">
      <div class="absolute inset-0 bg-[var(--color-azul-alto)]" />
      <div class="relative flex flex-col gap-2">
        <h1 class="text-3xl font-bold text-[var(--color-naranja)] md:text-4xl">Prensa</h1>
        <p class="text-sm text-white">
          Aquí puedes ver o escuchar las principales entrevistas de los medios a los que hemos sido invitados desde 2021.
        </p>
      </div>
    </section>

    <section v-for="grupo in grupos" :key="grupo.grupo" class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-[var(--color-azul)]">{{ grupo.grupo }}</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <VideoCard
          v-for="entrada in grupo.entradas"
          :key="entrada.url"
          :titulo="entrada.titular"
          :descripcion="(entrada.subtitulo ? entrada.subtitulo + ' · ' : '') + formatearFecha(entrada.fecha)"
          :imagen="entrada.imagen"
          :href="entrada.url"
          texto-boton="Ver más"
        />
      </div>
    </section>
  </div>
</template>
