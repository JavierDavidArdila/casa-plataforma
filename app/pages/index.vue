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

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus sodales justo,'

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

const videosTemporada1 = [1, 2, 3, 4, 5, 6].map((n) => ({ titulo: `Video Cuidado 0${n}`, descripcion: lorem }))
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="grid gap-[30px] p-[30px] lg:grid-cols-[395px_634px] lg:justify-center lg:gap-[60px]">
      <div class="flex flex-col items-start justify-center gap-[20px] py-6">
        <h1 class="text-[36px] font-bold leading-none text-[var(--color-secundario)]">Bienvenido a C.A.S.A.</h1>
        <p class="max-w-[395px] text-[16px] font-bold leading-none text-[var(--color-gris-dk)] [line-height:1.05]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus sodales justo, ac suscipit nulla
          aliquam et. Integer ac pharetra magna, id ultricies est
        </p>
        <BotonCasa to="/test">Hacer cuestionario de bienestar</BotonCasa>
      </div>

      <div class="relative flex h-[405px] items-center justify-center overflow-hidden rounded-[30px] px-[50px] py-[30px]">
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
      <div class="flex items-stretch gap-[40px] overflow-x-auto pb-2">
        <NuxtLink v-for="video in videosTemporada1" :key="video.titulo" to="/contenidos" class="flex w-[242px] shrink-0">
          <VideoCard :titulo="video.titulo" :descripcion="video.descripcion" />
        </NuxtLink>
      </div>
    </section>

    <!-- Prensa -->
    <section class="flex flex-col gap-[18px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Prensa</h2>
      <div class="grid gap-[40px] md:grid-cols-2">
        <VideoCard titulo="TV" :descripcion="lorem" to="/prensa" texto-boton="Conoce más" />
        <VideoCard titulo="Radio" :descripcion="lorem" to="/prensa" texto-boton="Conoce más" />
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
            <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.05]">{{ lorem }}</p>
            <BotonCasa to="/libros">Conoce más</BotonCasa>
          </div>
        </div>
        <div class="flex items-center gap-[30px] overflow-hidden rounded-[30px] bg-white p-[30px]">
          <div class="h-[212px] w-[178px] shrink-0">
            <img src="/images/libros/estados-unidos-canada-card.jpg" alt="Estados Unidos y Canadá" class="size-full object-cover" loading="lazy" />
          </div>
          <div class="flex min-w-0 flex-1 flex-col items-start gap-[15px]">
            <p class="text-[16px] font-bold leading-none text-[var(--color-gris-dk)]">Estados Unidos y Canadá</p>
            <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.05]">{{ lorem }}</p>
            <BotonCasa to="/libros">Conoce más</BotonCasa>
          </div>
        </div>
      </div>
    </section>

    <!-- Quiénes somos -->
    <section class="grid gap-[30px] border-t border-[#dcdcdc] p-[30px] lg:grid-cols-[634px_395px] lg:justify-between">
      <img src="/images/figma/hero-quienes-somos.jpg" alt="Quiénes somos" class="h-[405px] w-full rounded-[30px] object-cover" loading="lazy" />
      <div class="flex flex-col items-start justify-center gap-[20px] py-6">
        <h2 class="text-[24px] font-bold leading-none text-[var(--color-secundario)]">Quiénes somos</h2>
        <p class="text-[16px] font-bold text-[var(--color-gris-dk)] [line-height:1.05]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus sodales justo, ac suscipit nulla
          aliquam et. Integer ac pharetra magna, id ultricies est
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
