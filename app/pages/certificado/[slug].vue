<script setup lang="ts">
import { CERTIFICADOS } from '#shared/utils/certificado'

// Certificado de un contenido terminado (diseño del PDF "Certificado CASA" del cliente).
// Se imprime o se guarda como PDF desde el navegador.
definePageMeta({ layout: false })

const route = useRoute()
const slug = String(route.params.slug)
const certificado = CERTIFICADOS[slug]
if (!certificado) throw createError({ statusCode: 404, statusMessage: 'Certificado no encontrado' })

useSeoPagina({ title: `Certificado ${certificado.pilar} — C.A.S.A.`, description: 'Certificado del Programa C.A.S.A.', indexable: false })

const { sesion, cargarSesion } = useAuth()
const listo = ref(false)

onMounted(async () => {
  await cargarSesion()
  if (!sesion.value.autenticado) {
    await navigateTo('/iniciar-sesion')
    return
  }
  listo.value = true
})

const nombreCompleto = computed(() => [sesion.value.nombre, sesion.value.apellido].filter(Boolean).join(' '))

function imprimir() {
  window.print()
}
</script>

<template>
  <div v-if="listo" class="certificado-pagina flex min-h-screen flex-col items-center gap-[20px] bg-[var(--color-fondo)] p-[20px]">
    <div class="no-imprimir flex gap-[12px]">
      <BotonCasa sin-flecha @click="imprimir">Descargar / imprimir</BotonCasa>
      <BotonCasa to="/">Ir al inicio</BotonCasa>
    </div>

    <article class="certificado relative aspect-[1235/950] w-full max-w-[1000px] bg-white text-center text-[var(--color-gris-dk)]">
      <div class="absolute inset-[3%] border-[3px] border-[var(--color-primario)]" />
      <div class="absolute inset-[4%] border border-[var(--color-primario)]" />

      <img src="/images/brand/casa-logo.png" alt="C.A.S.A. — Del Cuidado a Distancia" class="absolute left-[8%] top-[9%] w-[22%]" />

      <div class="sello absolute right-[8%] top-[7%] flex aspect-square w-[16%] items-center justify-center rounded-full border-[6px] border-[var(--color-secundario)] bg-[var(--color-primario)]">
        <img src="/favicon-192.png" alt="" class="w-[62%] brightness-0 invert" />
      </div>

      <div class="absolute inset-x-[12%] top-[38%] flex flex-col items-center gap-[2.2vw] lg:gap-[22px]">
        <p class="nombre font-semibold leading-none text-[var(--color-secundario)]">{{ nombreCompleto }}</p>
        <hr class="w-full border-[var(--color-gris-md)]" />
        <p class="texto">
          Programa de Bienestar para cuidadores a distancia, certifica<br />
          que en la Primera Temporada asimilaste que es <strong>{{ certificado.pilar }}</strong><br />
          cuando cuidas a la distancia.
        </p>
        <p class="texto">{{ certificado.logro }}</p>
        <p class="felicidades font-bold text-[var(--color-primario)]">¡Felicidades!</p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.nombre {
  font-size: clamp(28px, 6vw, 64px);
}
.texto {
  font-size: clamp(12px, 1.9vw, 20px);
  line-height: 1.35;
}
.felicidades {
  font-size: clamp(16px, 2.6vw, 28px);
}
@media print {
  @page {
    size: landscape;
    margin: 0;
  }
  .no-imprimir {
    display: none;
  }
  .certificado-pagina {
    padding: 0;
    background: white;
  }
  .certificado {
    max-width: none;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .nombre { font-size: 60px; }
  .texto { font-size: 19px; }
  .felicidades { font-size: 26px; }
}
</style>
