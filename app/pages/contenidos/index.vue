<script setup lang="ts">
import { VIDEOS } from '~/data/videos'
import { OPINION_ACCESO } from '~/data/opinion-acceso'

useSeoMeta({ title: 'Contenidos — C.A.S.A.' })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
})

const faltan = computed(() => VIDEOS.length - (sesion.value.opinionesEnviadas ?? []).length)
const diasRestantes = computed(() => {
  if (!sesion.value.venceEn) return null
  return Math.max(0, Math.ceil((new Date(sesion.value.venceEn).getTime() - Date.now()) / 86_400_000))
})

const rutaSuscripcion = computed(() => (sesion.value.tieneCuenta ? '/pago' : sesion.value.autenticado ? '/crear-cuenta' : '/registrarse'))
</script>

<template>
  <div v-if="!verificando" class="flex flex-col gap-[18px] px-[30px] py-[50px]">
    <h1 class="titulo-seccion">Primera temporada</h1>
    <p class="text-[16px] text-[var(--color-gris-dk)]">
      4 videos, uno por cada pilar del cuidado a distancia: Comprender, Acompañar, Sostener y Aliviar.
    </p>

    <div v-if="sesion.tipoAcceso" class="rounded-[10px] border border-[var(--color-primario)] bg-white px-5 py-4 text-[16px] text-[var(--color-gris-dk)]">
      <p class="font-bold">{{ faltan > 0 ? OPINION_ACCESO.avisoFaltantes(faltan) : OPINION_ACCESO.completo }}</p>
      <p v-if="faltan > 0">Mira cada video y cuéntanos qué te pareció: si te gustó o no, y un mensaje.</p>
      <p v-if="diasRestantes !== null" class="text-[14px]">Tu acceso vence en {{ diasRestantes }} {{ diasRestantes === 1 ? 'día' : 'días' }}.</p>
    </div>

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
