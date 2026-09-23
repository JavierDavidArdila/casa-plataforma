<script setup lang="ts">
import { VIDEOS } from '~/data/videos'

useSeoMeta({ title: 'Contenidos — C.A.S.A.' })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
})

const rutaSuscripcion = computed(() => (sesion.value.tieneCuenta ? '/pago' : sesion.value.autenticado ? '/crear-cuenta' : '/registrarse'))
</script>

<template>
  <div v-if="!verificando" class="flex flex-col gap-8 px-6 py-10 md:px-10">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-[var(--color-azul)]">Primera temporada</h1>
      <p class="text-sm text-[var(--color-texto-suave)]">
        4 videos, uno por cada pilar del cuidado a distancia: Comprender, Acompañar, Sostener y Aliviar.
      </p>
    </div>

    <div v-if="!sesion.suscrito" class="rounded-[var(--radius-editorial)] border border-[var(--color-naranja)] bg-[var(--color-naranja)]/10 px-5 py-4 text-sm">
      Estás viendo trailers.
      <NuxtLink :to="rutaSuscripcion" class="font-semibold text-[var(--color-azul)] underline">Suscríbete</NuxtLink>
      para ver los videos completos.
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <component
        :is="sesion.suscrito ? 'NuxtLink' : 'div'"
        v-for="video in VIDEOS"
        :key="video.slug"
        :to="sesion.suscrito ? `/contenidos/${video.slug}` : undefined"
      >
        <VideoCard
          :titulo="video.titulo"
          :descripcion="video.descripcion"
          :etiqueta="sesion.suscrito ? video.titulo : `Trailer — ${video.titulo}`"
          :bloqueado="!sesion.suscrito"
          :texto-boton="sesion.suscrito ? 'Ver video' : 'Ver trailer'"
        />
      </component>
    </div>
  </div>
</template>
