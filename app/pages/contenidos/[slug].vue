<script setup lang="ts">
import { obtenerVideo, obtenerSiguienteVideo } from '~/data/videos'
import { OPINION_ACCESO } from '~/data/opinion-acceso'

const route = useRoute()
const slug = String(route.params.slug)
const video = obtenerVideo(slug)

if (!video) {
  throw createError({ statusCode: 404, statusMessage: 'Video no encontrado' })
}
if (!video.disponible) {
  await navigateTo('/', { redirectCode: 302 })
}

const siguiente = obtenerSiguienteVideo(slug)

useSeoPagina({ title: `${video.titulo} — Contenidos — C.A.S.A.`, description: video.descripcion, indexable: false })

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
  // Sin suscripción no se ve nada aquí: en vez de volver al inicio sin explicación, se lleva al
  // visitante a inscribirse (o a activar la suscripción si ya tiene sesión).
  if (!sesion.value.suscrito) {
    await navigateTo(sesion.value.autenticado ? '/pago' : '/registrarse')
    return
  }
  try {
    const p = await $fetch<{ visto: boolean; guia: boolean; preguntas: boolean; correoEnviado: boolean }>(`/api/contenido/${slug}/progreso`)
    visto.value = p.visto
    guiaDescargada.value = p.guia
    enviado.value = p.preguntas
    correoEnviado.value = p.correoEnviado
  } catch {
    // Sin progreso guardado (o tabla aún no creada): empieza desde el video.
  }
})

// Recorrido del contenido (pedido del cliente, 5 oct 2026):
// 1) ver el video completo → 2) descargar la guía PDF → 3) responder las 3 preguntas → correo de felicitación.
const urlVideo = `/api/contenido/${slug}/video`
const urlGuia = `/api/contenido/${slug}/guia`
const visto = ref(false)
const guiaDescargada = ref(false)
const videoNoDisponible = ref(false)

async function alTerminarVideo() {
  if (visto.value) return
  visto.value = true
  await $fetch(`/api/contenido/${slug}/visto`, { method: 'POST' }).catch(() => {})
}

// Si el video todavía no está cargado en el servidor, no dejamos al usuario sin poder seguir.
function alFallarVideo() {
  videoNoDisponible.value = true
  visto.value = true
}

function alDescargarGuia() {
  guiaDescargada.value = true
}

// Invitados y prensa: opinión por video (¿te gustó? + mensaje) en lugar de "Comparte".
const meGusto = ref<boolean | null>(null)
const mensajeOpinion = ref('')
const enviandoOpinion = ref(false)
const opinionEnviada = ref(false)
const errorOpinion = ref<string | null>(null)

const yaOpino = computed(() => opinionEnviada.value || (sesion.value.opinionesEnviadas ?? []).includes(slug))

async function enviarOpinionAcceso() {
  if (meGusto.value === null) {
    errorOpinion.value = 'Cuéntanos si te gustó o no.'
    return
  }
  enviandoOpinion.value = true
  errorOpinion.value = null
  try {
    await $fetch('/api/opinion', {
      method: 'POST',
      body: { video: slug, meGusto: meGusto.value, mensaje: mensajeOpinion.value },
    })
    opinionEnviada.value = true
    await cargarSesion()
  } catch (e) {
    errorOpinion.value = (e as { statusMessage?: string })?.statusMessage || 'No pudimos guardar tu opinión. Inténtalo de nuevo.'
  } finally {
    enviandoOpinion.value = false
  }
}

const queSirvio = ref('')
const queProfundizar = ref('')
const otroTema = ref('')
const enviando = ref(false)
const enviado = ref(false)
const correoEnviado = ref(false)
const error = ref<string | null>(null)

const preguntasCompletas = computed(() => Boolean(queSirvio.value.trim() && queProfundizar.value.trim() && otroTema.value.trim()))

async function enviarOpinion() {
  if (!preguntasCompletas.value) {
    error.value = 'Responde las tres preguntas para terminar.'
    return
  }
  enviando.value = true
  error.value = null
  try {
    const r = await $fetch<{ correoEnviado?: boolean }>('/api/comparte', {
      method: 'POST',
      body: { video: video!.slug, queSirvio: queSirvio.value, queProfundizar: queProfundizar.value, otroTema: otroTema.value },
    })
    correoEnviado.value = Boolean(r?.correoEnviado)
    enviado.value = true
  } catch {
    error.value = 'No pudimos guardar tus respuestas. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div v-if="!verificando && sesion.suscrito">
    <div class="grid gap-[30px] p-[30px] lg:grid-cols-[minmax(0,634px)_minmax(0,405px)] lg:justify-between">
      <div class="flex flex-col gap-[20px]">
        <div class="relative overflow-hidden rounded-[30px] bg-black">
          <video
            :src="urlVideo"
            controls
            playsinline
            preload="metadata"
            controlslist="nodownload"
            class="aspect-video w-full"
            @ended="alTerminarVideo"
            @error="alFallarVideo"
          />
          <p v-if="videoNoDisponible" class="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-[16px] font-semibold text-white">
            El video estará disponible muy pronto. Mientras tanto, puedes descargar la guía.
          </p>
        </div>
        <div class="flex h-[95px] items-center justify-center rounded-[30px] bg-white text-[16px] font-semibold text-[var(--color-gris-dk)]">
          Patrocinio
        </div>
      </div>

      <div class="flex flex-col items-start gap-[20px]">
        <p class="titulo-seccion">{{ video!.numero }}</p>
        <h1 class="text-[36px] font-bold leading-none text-[var(--color-secundario)]">{{ video!.titulo }}</h1>
        <p class="text-[16px] font-bold text-[var(--color-gris-dk)] [line-height:1.2]">{{ video!.texto }}</p>

        <ol class="flex w-full flex-col gap-[12px] rounded-[30px] bg-white p-[25px] text-[16px] text-[var(--color-gris-dk)]">
          <li class="flex flex-col gap-[10px]">
            <span :class="visto ? 'font-bold text-[var(--color-secundario)]' : 'font-bold'">{{ visto ? '✓' : '1.' }} Mira el video completo</span>
          </li>
          <li class="flex flex-col items-start gap-[10px]">
            <span :class="guiaDescargada ? 'font-bold text-[var(--color-secundario)]' : visto ? 'font-bold' : 'text-[var(--color-gris-md)]'">
              {{ guiaDescargada ? '✓' : '2.' }} Descarga la guía y haz el ejercicio
            </span>
            <BotonCasa v-if="visto" :href="urlGuia" @click="alDescargarGuia">Descargar PDF</BotonCasa>
            <BotonCasa v-else disabled>Descargar PDF</BotonCasa>
          </li>
          <li>
            <span :class="enviado ? 'font-bold text-[var(--color-secundario)]' : guiaDescargada ? 'font-bold' : 'text-[var(--color-gris-md)]'">
              {{ enviado ? '✓' : '3.' }} Responde tres preguntas
            </span>
          </li>
        </ol>
      </div>
    </div>

    <div class="grid gap-[30px] border-t border-[#dcdcdc] p-[30px] lg:grid-cols-[minmax(0,634px)_minmax(0,405px)] lg:justify-between">
      <div v-if="slug === 'sostener' && !sesion.referidosEnviados" class="flex flex-col items-start gap-[10px] self-start rounded-[30px] bg-white p-[30px]">
        <p class="text-[24px] font-bold leading-none text-[var(--color-gris-dk)]">¡Felicitaciones, llegaste a Sostener!</p>
        <p class="text-[16px] text-[var(--color-gris-dk)]">Antes de cerrar con Aliviar, comparte C.A.S.A. con tres familiares o amigos.</p>
        <BotonCasa to="/referidos">Compartir con tres personas</BotonCasa>
      </div>
      <div v-else-if="siguiente" class="flex items-center gap-[25px] self-start rounded-[30px] bg-white p-[30px]">
        <img src="/images/figma/video-card.png" alt="" class="h-[147px] w-[251px] shrink-0 rounded-[20px] object-cover" />
        <div class="flex flex-col items-start gap-[10px]">
          <p class="text-[16px] leading-none text-[var(--color-gris-dk)]">Próximo contenido</p>
          <p class="text-[24px] font-bold leading-none text-[var(--color-gris-dk)]">{{ siguiente.titulo }}</p>
          <BotonCasa v-if="siguiente.disponible" :to="`/contenidos/${siguiente.slug}`">Ver video</BotonCasa>
          <BotonCasa v-else disabled>Pronto {{ siguiente.titulo.toUpperCase() }}</BotonCasa>
        </div>
      </div>

      <div class="flex flex-col gap-[20px]">
        <template v-if="sesion.tipoAcceso">
          <h2 class="titulo-seccion">{{ OPINION_ACCESO.titulo }}</h2>
          <div class="flex flex-col gap-[20px] rounded-[30px] bg-white p-[25px]">
            <p v-if="opinionEnviada" class="text-[16px] text-[var(--color-gris-dk)]">{{ OPINION_ACCESO.gracias }}</p>
            <template v-else>
              <p v-if="yaOpino" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">Ya opinaste sobre este video; si vuelves a enviar, reemplazamos tu opinión.</p>
              <fieldset class="flex flex-col gap-[12px]">
                <legend class="etiqueta-casa">{{ OPINION_ACCESO.preguntaMeGusto }}</legend>
                <div class="flex flex-wrap gap-[12px]">
                  <label class="flex cursor-pointer items-center gap-[8px] text-[16px] text-[var(--color-gris-dk)]">
                    <input v-model="meGusto" type="radio" name="me-gusto" :value="true" /> {{ OPINION_ACCESO.etiquetaSi }}
                  </label>
                  <label class="flex cursor-pointer items-center gap-[8px] text-[16px] text-[var(--color-gris-dk)]">
                    <input v-model="meGusto" type="radio" name="me-gusto" :value="false" /> {{ OPINION_ACCESO.etiquetaNo }}
                  </label>
                </div>
              </fieldset>
              <label class="flex flex-col gap-[12px]">
                <span class="etiqueta-casa">{{ OPINION_ACCESO.etiquetaMensaje }}</span>
                <textarea v-model="mensajeOpinion" rows="4" maxlength="2000" :placeholder="OPINION_ACCESO.placeholderMensaje" class="campo-casa" />
              </label>
              <p v-if="errorOpinion" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ errorOpinion }}</p>
              <BotonCasa :disabled="enviandoOpinion" @click="enviarOpinionAcceso">{{ enviandoOpinion ? 'Enviando...' : OPINION_ACCESO.boton }}</BotonCasa>
            </template>
          </div>
        </template>
        <template v-else>
        <h2 class="titulo-seccion">Comparte</h2>
        <div class="flex flex-col gap-[20px] rounded-[30px] bg-white p-[25px]">
          <p v-if="!guiaDescargada && !enviado" class="text-[16px] text-[var(--color-gris-dk)]">
            Cuando termines el video y descargues la guía, responde aquí tres preguntas para completar {{ video!.titulo }}.
          </p>
          <template v-else-if="!enviado">
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
            <p v-if="error" class="text-[14px] font-semibold text-[var(--color-gris-dk)]">{{ error }}</p>
            <BotonCasa :disabled="enviando" @click="enviarOpinion">{{ enviando ? 'Enviando...' : 'Enviar respuestas' }}</BotonCasa>
          </template>
          <div v-else class="flex flex-col items-start gap-[12px] text-[16px] text-[var(--color-gris-dk)]">
            <p class="text-[24px] font-bold leading-none text-[var(--color-primario)]">¡Felicidades!</p>
            <p>Terminaste {{ video!.titulo }}. {{ correoEnviado ? 'Te enviamos un correo de felicitación con tu certificado.' : '' }}</p>
            <BotonCasa :to="`/certificado/${slug}`">Ver mi certificado</BotonCasa>
          </div>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>
