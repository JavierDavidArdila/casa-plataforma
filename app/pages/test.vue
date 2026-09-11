<script setup lang="ts">
const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
  if (!sesion.value.autenticado) {
    await navigateTo('/registrarse')
  }
})
</script>

<template>
  <div v-if="!verificando && sesion.autenticado">
    <TestBienestar />
  </div>
</template>
