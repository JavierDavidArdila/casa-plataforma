<script setup lang="ts">
useSeoMeta({ title: 'Contenidos — C.A.S.A.' })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
})

const videos = [
  { titulo: 'Video Comprender', descripcion: 'Culpa, sensación de insuficiencia, aceptación del nuevo rol.' },
  { titulo: 'Video Acompañar', descripcion: 'Comunicación, tensión emocional, calidad del vínculo.' },
  { titulo: 'Video Sostener', descripcion: 'Dependencia excesiva, red familiar, organización del cuidado.' },
  { titulo: 'Video Aliviar', descripcion: 'Sobrecarga general, equilibrio entre cuidado y vida propia.' },
]

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
      <div v-for="video in videos" :key="video.titulo" class="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-3">
        <div class="relative">
          <ImagenPlaceholder :etiqueta="sesion.suscrito ? video.titulo : `Trailer — ${video.titulo}`" />
          <span
            v-if="!sesion.suscrito"
            class="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white"
          >
            🔒 Solo suscriptores
          </span>
        </div>
        <div>
          <p class="font-semibold">{{ video.titulo }}</p>
          <p class="text-sm text-[var(--color-texto-suave)]">{{ video.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
