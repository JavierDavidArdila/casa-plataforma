<script setup lang="ts">
useSeoPagina({
  title: 'C.A.S.A. — Del Cuidado a Distancia',
  description: 'El primer Programa de Bienestar para cuidadores a distancia: Cuestionario de Bienestar, videos y acompañamiento para quienes cuidan a sus padres desde lejos.',
})

// Datos estructurados (Organization + WebSite) con la URL canónica de la raíz.
const sitioUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${sitioUrl}/#organizacion`,
            name: 'C.A.S.A. — Del Cuidado a Distancia',
            url: `${sitioUrl}/`,
            logo: `${sitioUrl}/images/brand/casa-logo.png`,
          },
          {
            '@type': 'WebSite',
            '@id': `${sitioUrl}/#sitio`,
            url: `${sitioUrl}/`,
            name: 'C.A.S.A. — Del Cuidado a Distancia',
            inLanguage: 'es-CO',
            publisher: { '@id': `${sitioUrl}/#organizacion` },
          },
        ],
      }),
    },
  ],
})

import { VIDEOS } from '~/data/videos'
import { EDICION_COLOMBIA, EDICION_USA } from '~/data/libro'
import { PRENSA } from '~/data/prensa'

// Servido desde R2 (bucket casa-videos) por server/routes/videos; no es un asset del build.
const urlVideoBienvenida = '/videos/bienvenida.mp4?v=2'
const reproduciendo = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)

function precargar() {
  if (videoEl.value && videoEl.value.preload !== 'auto') videoEl.value.preload = 'auto'
}

function reproducir() {
  reproduciendo.value = true
  videoEl.value?.play().catch(() => {})
}

// Textos de la Primera temporada (Word del 30 sep 2026), en el orden de VIDEOS.
const DESCRIPCIONES_TEMPORADA1 = [
  'Aquí entenderás mejor tu realidad y tus límites. Luego descarga el material de apoyo para poner todo en práctica.',
  'A cuidarte a ti mismo(a). Y descarga el material de apoyo para practicar cómo cuidarte.',
  'Aprenderás a manejar tus emociones para continuar cuidando. Y con el material de apoyo descargable lo harás más práctico.',
  'En este espacio aprenderás nuevamente a darle espacio a la vida y a ponerlo en blanco y negro con el material de apoyo descargable.',
]
const videosTemporada1 = VIDEOS.map((video, i) => ({
  titulo: `Contenido ${i + 1}. ${video.titulo.toUpperCase()}`,
  descripcion: DESCRIPCIONES_TEMPORADA1[i] ?? video.descripcion,
  boton: `Ve a ${video.titulo.toUpperCase()}`,
}))
</script>

<template>
  <div>
    <!-- Hero -->
    <!-- Columnas flexibles (minmax) para que el texto nunca se salga hacia el menú en pantallas medianas,
         y padding lateral para que el video no quede pegado al borde. -->
    <section class="grid gap-[30px] px-[30px] py-[30px] lg:grid-cols-[minmax(0,420px)_minmax(0,634px)] lg:justify-center lg:gap-[50px] lg:px-[50px]">
      <div class="flex min-w-0 flex-col items-start justify-center gap-[14px] py-6 text-[16px] text-[var(--color-gris-dk)] [line-height:1.3]">
        <h1 class="text-[36px] font-bold leading-none text-[var(--color-secundario)]">Bienvenidos a C.A.S.A.</h1>
        <p class="font-bold">Tu C.A.S.A. está abierta y te da la bienvenida a su primera temporada.</p>
        <p>C.A.S.A. es el primer Programa de Bienestar para cuidadores a distancia para hispanos.</p>
        <p>
          Aprenderás herramientas prácticas para tu autocuidado, estés donde estés, con nuestra metodología basada en
          cuatro pilares de la Psicología del cuidado: Comprender, Aprender, Sostener y Aliviar.
        </p>
        <p>
          Ya no estás solo(a). Ahora serás parte de esta comunidad donde todos aprendemos, compartimos y nos cuidamos.
          Porque amar y cuidar a la distancia sí es posible.
        </p>
        <p class="font-bold text-[var(--color-secundario)]">La distancia se mide en kilómetros. El cuidado, en presencia.</p>
        <p>Comienza contestando el Cuestionario que te indicará en qué nivel de Bienestar estás.</p>
        <p class="font-bold">Bienvenido(a) a la Primera Temporada. Esta es tu C.A.S.A.</p>
        <BotonCasa to="/test">Hacer cuestionario de bienestar</BotonCasa>
      </div>

      <div class="relative flex h-[405px] min-w-0 items-center justify-center overflow-hidden rounded-[30px] px-[50px] py-[30px]">
        <!-- El <video> vive siempre en la página (solo metadatos hasta el clic) para que, al
             tocar play, el arranque sea inmediato; al acercar el puntero se pide que precargue. -->
        <video
          ref="videoEl"
          :src="urlVideoBienvenida"
          poster="/images/bienvenida-poster.jpg"
          class="absolute inset-0 size-full bg-black object-cover"
          :controls="reproduciendo"
          playsinline
          preload="metadata"
        />
        <template v-if="!reproduciendo">
          <div class="pointer-events-none absolute inset-0 bg-black/20" />
          <button
            type="button"
            aria-label="Reproducir video de bienvenida"
            class="relative text-white"
            @pointerenter="precargar"
            @focus="precargar"
            @touchstart.passive="precargar"
            @click="reproducir"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
              <circle cx="20" cy="20" r="18" />
              <path d="m16.5 13 11 7-11 7Z" />
            </svg>
          </button>
        </template>
      </div>
    </section>

    <!-- Primera temporada -->
    <section class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Primera temporada</h2>
      <div class="grid items-stretch gap-[30px] sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="video in videosTemporada1" :key="video.titulo" class="flex">
          <VideoCard :titulo="video.titulo" :descripcion="video.descripcion" to="/contenidos" :texto-boton="video.boton" />
        </div>
      </div>
    </section>

    <!-- Prensa -->
    <section class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Prensa</h2>
      <div class="grid gap-[40px] md:grid-cols-2">
        <VideoCard
          v-for="entrada in PRENSA"
          :key="entrada.titulo"
          :titulo="entrada.titulo"
          :descripcion="entrada.descripcion"
          :imagen="entrada.imagen"
          to="/prensa"
          texto-boton="Conoce más"
        />
      </div>
    </section>

    <!-- Libros -->
    <section class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Libros</h2>
      <div class="grid gap-[40px] md:grid-cols-2">
        <div class="flex items-center gap-[30px] overflow-hidden rounded-[30px] bg-white p-[30px]">
          <div class="h-[212px] w-[178px] shrink-0">
            <img src="/images/libros/colombia-latinoamerica-card.jpg" alt="Colombia y Latinoamérica" class="size-full object-cover" loading="lazy" />
          </div>
          <div class="flex min-w-0 flex-1 flex-col items-start gap-[15px]">
            <p class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">Colombia y Latinoamérica</p>
            <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.2]">{{ EDICION_COLOMBIA.resumen }}</p>
            <BotonCasa to="/libros">Conoce más</BotonCasa>
          </div>
        </div>
        <div class="flex items-center gap-[30px] overflow-hidden rounded-[30px] bg-white p-[30px]">
          <div class="h-[212px] w-[178px] shrink-0">
            <img src="/images/libros/estados-unidos-canada-card.jpg" alt="Estados Unidos y Canadá" class="size-full object-cover" loading="lazy" />
          </div>
          <div class="flex min-w-0 flex-1 flex-col items-start gap-[15px]">
            <p class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">Estados Unidos y Canadá</p>
            <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.2]">{{ EDICION_USA.resumen }}</p>
            <BotonCasa to="/libros">Conoce más</BotonCasa>
          </div>
        </div>
      </div>
    </section>

    <!-- Quiénes somos -->
    <section class="grid gap-[30px] border-t border-[#dcdcdc] p-[30px] lg:grid-cols-[minmax(0,634px)_minmax(0,395px)] lg:justify-between">
      <img src="/images/figma/hero-quienes-somos.jpg" alt="Quiénes somos" class="h-[405px] w-full rounded-[30px] object-cover" loading="lazy" />
      <div class="flex flex-col items-start justify-center gap-[20px] py-6">
        <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Quiénes somos</h2>
        <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.3]">
          Somos los creadores de la metodología de cuidado emocional para quienes cuidan a distancia C.A.S.A. con sus
          pilares Comprender, Aprender, Sostener y Aliviar, y los productores de la plataforma virtual de educación que
          inicia su primera temporada.
        </p>
        <BotonCasa to="/quienes-somos">Conoce más</BotonCasa>
      </div>
    </section>

    <!-- Regístrate -->
    <section class="flex flex-col items-center gap-[20px] border-t border-[#dcdcdc] px-[30px] py-[60px] text-center">
      <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Regístrate</h2>
      <p class="max-w-[520px] text-[16px] text-[var(--color-gris-dk)] [line-height:1.2]">
        Cuéntanos un poco de ti, haz el Cuestionario de Bienestar y recibe contenidos pensados para quienes cuidan a
        sus padres a distancia.
      </p>
      <BotonCasa to="/registrarse">Registrarme</BotonCasa>
    </section>
  </div>
</template>
