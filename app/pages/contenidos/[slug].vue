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
  <div v-if="!verificando && sesion.suscrito" class="grid gap-8 px-6 py-10 md:grid-cols-[1fr_360px] md:px-10">
    <div class="flex flex-col gap-6">
      <div class="relative overflow-hidden rounded-[var(--radius-card)]">
        <ImagenPlaceholder aspecto="aspect-video" :etiqueta="video!.titulo" />
        <button
          type="button"
          :aria-label="`Reproducir ${video!.titulo}`"
          class="absolute inset-0 flex items-center justify-center"
        >
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--color-azul)] shadow-lg">
            <IconoNav nombre="play" />
          </span>
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <p class="kicker text-[var(--color-azul)]">{{ video!.numero }}</p>
        <h1 class="text-3xl font-bold text-[var(--color-azul)]">{{ video!.titulo }}</h1>
        <p class="text-[var(--color-texto-suave)]">{{ video!.descripcion }}</p>
        <a
          href="#"
          class="inline-flex w-fit items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-6 py-3 text-sm font-medium text-white"
        >
          Descargar PDF ↗
        </a>
      </div>

      <div class="flex items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-6 text-sm text-[var(--color-texto-suave)]">
        Patrocinio
      </div>

      <NuxtLink
        v-if="siguiente"
        :to="`/contenidos/${siguiente.slug}`"
        class="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-4"
      >
        <ImagenPlaceholder aspecto="aspect-video w-40" :etiqueta="siguiente.titulo" />
        <div class="flex flex-col gap-2">
          <p class="text-xs text-[var(--color-texto-suave)]">Próximo video</p>
          <p class="text-lg font-bold text-[var(--color-azul)]">{{ siguiente.titulo }}</p>
          <span class="inline-flex w-fit items-center gap-1 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-4 py-2 text-sm font-medium text-white">
            Ver video ↗
          </span>
        </div>
      </NuxtLink>
    </div>

    <aside class="flex flex-col gap-4 self-start rounded-[var(--radius-card)] bg-[var(--color-superficie)] p-6">
      <h2 class="text-lg font-bold text-[var(--color-azul)]">Comparte</h2>

      <template v-if="!enviado">
        <label class="flex flex-col gap-2 text-sm">
          <span>1. ¿Qué te sirvió de este contenido?</span>
          <textarea v-model="queSirvio" rows="2" placeholder="Escribe aquí" class="campo" />
        </label>
        <label class="flex flex-col gap-2 text-sm">
          <span>2. ¿Qué quieres profundizar?</span>
          <textarea v-model="queProfundizar" rows="2" placeholder="Escribe aquí" class="campo" />
        </label>
        <label class="flex flex-col gap-2 text-sm">
          <span>3. Compártenos otro tema que te interese</span>
          <textarea v-model="otroTema" rows="2" placeholder="Escribe aquí" class="campo" />
        </label>
        <button
          type="button"
          :disabled="enviando"
          class="inline-flex w-fit items-center gap-2 rounded-[var(--radius-editorial)] bg-[var(--color-naranja)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          @click="enviarOpinion"
        >
          {{ enviando ? 'Enviando...' : 'Enviar opinión' }} →
        </button>
      </template>
      <p v-else class="text-sm text-[var(--color-texto-suave)]">
        {{ error ?? '¡Gracias por tu opinión!' }}
      </p>
    </aside>
  </div>
</template>

<style scoped>
.campo {
  border: 1px solid var(--color-borde);
  background: var(--color-fondo);
  border-radius: 0.5rem;
  padding: 0.6rem 0.9rem;
  outline: none;
  resize: none;
  font-size: 0.875rem;
}
.campo:focus {
  border-color: var(--color-azul);
}
</style>
