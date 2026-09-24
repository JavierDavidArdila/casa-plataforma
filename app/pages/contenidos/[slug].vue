<script setup lang="ts">
import { obtenerVideo, obtenerSiguienteVideo } from '~/data/videos'

const route = useRoute()
const slug = String(route.params.slug)
const video = obtenerVideo(slug)

if (!video) {
  throw createError({ statusCode: 404, statusMessage: 'Video no encontrado' })
}

const siguiente = obtenerSiguienteVideo(slug)

useSeoMeta({ title: `${video.titulo} — Contenidos — C.A.S.A.` })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
  if (!sesion.value.suscrito) {
    await navigateTo('/contenidos')
  }
})

const queSirvio = ref('')
const queProfundizar = ref('')
const otroTema = ref('')
const enviando = ref(false)
const enviado = ref(false)
const error = ref<string | null>(null)

async function enviarOpinion() {
  enviando.value = true
  error.value = null
  try {
    await $fetch('/api/comparte', {
      method: 'POST',
      body: { video: video!.slug, queSirvio: queSirvio.value, queProfundizar: queProfundizar.value, otroTema: otroTema.value },
    })
    enviado.value = true
  } catch {
    error.value = 'No pudimos guardar tu opinión, pero gracias por compartirla.'
    enviado.value = true
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div v-if="!verificando && sesion.suscrito">
    <div class="grid gap-[30px] p-[30px] lg:grid-cols-[minmax(0,634px)_minmax(0,405px)] lg:justify-between">
      <div class="flex flex-col gap-[20px]">
        <div class="relative flex h-[563px] items-center justify-center overflow-hidden rounded-[30px]">
          <img src="/images/figma/hero-home.png" alt="" class="absolute inset-0 size-full object-cover" />
          <div class="absolute inset-0 bg-black/20" />
          <button type="button" :aria-label="`Reproducir ${video!.titulo}`" class="relative text-white">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
              <circle cx="20" cy="20" r="18" />
              <path d="m16.5 13 11 7-11 7Z" />
            </svg>
          </button>
        </div>
        <div class="flex h-[95px] items-center justify-center rounded-[30px] bg-white text-[16px] font-semibold text-[var(--color-gris-dk)]">
          Patrocinio
        </div>
      </div>

      <div class="flex flex-col items-start gap-[20px]">
        <p class="titulo-seccion">{{ video!.numero }}</p>
        <h1 class="text-[36px] font-bold leading-none text-[var(--color-secundario)]">{{ video!.titulo }}</h1>
        <p class="text-[16px] font-bold text-[var(--color-gris-dk)] [line-height:1.05]">{{ video!.descripcion }}</p>
        <BotonCasa href="#">Descargar PDF</BotonCasa>
      </div>
    </div>

    <div class="grid gap-[30px] border-t border-[#dcdcdc] p-[30px] lg:grid-cols-[minmax(0,634px)_minmax(0,405px)] lg:justify-between">
      <NuxtLink
        v-if="siguiente"
        :to="`/contenidos/${siguiente.slug}`"
        class="flex items-center gap-[25px] self-start rounded-[30px] bg-white p-[30px]"
      >
        <img src="/images/figma/video-card.png" alt="" class="h-[147px] w-[251px] shrink-0 rounded-[20px] object-cover" />
        <div class="flex flex-col items-start gap-[10px]">
          <p class="text-[16px] leading-none text-[var(--color-gris-dk)]">Próximo video</p>
          <p class="text-[24px] font-bold leading-none text-[var(--color-gris-dk)]">{{ siguiente.titulo }}</p>
          <BotonCasa>Ver video</BotonCasa>
        </div>
      </NuxtLink>

      <div class="flex flex-col gap-[20px]">
        <h2 class="titulo-seccion">Comparte</h2>
        <div class="flex flex-col gap-[20px] rounded-[30px] bg-white p-[25px]">
          <template v-if="!enviado">
            <label class="flex flex-col gap-[20px]">
              <span class="etiqueta-casa">¿Qué te sirvió de este contenido?</span>
              <textarea v-model="queSirvio" rows="2" placeholder="Escribe aquí" class="campo-casa" />
            </label>
            <label class="flex flex-col gap-[20px]">
              <span class="etiqueta-casa">¿Qué quieres profundizar?</span>
              <textarea v-model="queProfundizar" rows="2" placeholder="Escribe aquí" class="campo-casa" />
            </label>
            <label class="flex flex-col gap-[20px]">
              <span class="etiqueta-casa">Compártenos otro tema que te interese</span>
              <textarea v-model="otroTema" rows="2" placeholder="Escribe aquí" class="campo-casa" />
            </label>
            <BotonCasa :disabled="enviando" @click="enviarOpinion">{{ enviando ? 'Enviando...' : 'Enviar opinión' }}</BotonCasa>
          </template>
          <p v-else class="text-[16px] text-[var(--color-gris-dk)]">
            {{ error ?? '¡Gracias por tu opinión!' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
