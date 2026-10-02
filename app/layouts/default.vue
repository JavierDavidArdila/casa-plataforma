<script setup lang="ts">
// Seguimiento de páginas vistas solo para invitados/prensa (el servidor ignora a los demás).
const route = useRoute()
const { sesion } = useAuth()
const { paginaVista } = useSeguimiento()
let ultimaRuta = ''
watch(
  () => [route.path, sesion.value.tipoAcceso] as const,
  ([ruta, tipo]) => {
    if (!tipo || ruta === ultimaRuta) return
    ultimaRuta = ruta
    paginaVista()
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex min-h-screen bg-[var(--color-fondo)]">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main class="flex-1">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>
