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
  <div v-if="!verificando" class="flex flex-col gap-[18px] px-[30px] py-[50px]">
    <h1 class="titulo-seccion">Primera temporada</h1>
    <p class="text-[16px] text-[var(--color-gris-dk)]">
      4 videos, uno por cada pilar del cuidado a distancia: Comprender, Acompañar, Sostener y Aliviar.
    </p>

    <div v-if="!sesion.suscrito" class="rounded-[10px] border border-[var(--color-primario)] bg-white px-5 py-4 text-[16px] text-[var(--color-gris-dk)]">
      Estás viendo trailers.
      <NuxtLink :to="rutaSuscripcion" class="font-bold text-[var(--color-secundario)] underline">Suscríbete</NuxtLink>
      para ver los videos completos.
    </div>

    <div class="flex flex-wrap items-stretch gap-[40px]">
      <component
        :is="sesion.suscrito ? 'NuxtLink' : 'div'"
        v-for="video in VIDEOS"
        :key="video.slug"
        :to="sesion.suscrito ? `/contenidos/${video.slug}` : undefined"
        class="flex w-[242px]"
      >
        <VideoCard
          :titulo="video.titulo"
          :descripcion="video.descripcion"
          :bloqueado="!sesion.suscrito"
          :texto-boton="sesion.suscrito ? 'Ver video' : 'Ver trailer'"
        />
      </component>
    </div>
  </div>
</template>
