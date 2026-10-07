<script setup lang="ts">
useSeoPagina({
  title: 'Cuestionario de Bienestar — C.A.S.A.',
  description: 'Responde el Cuestionario de Bienestar y conoce cómo estás viviendo el cuidado a distancia de tus padres, con recomendaciones según tu resultado.',
})

const { sesion, cargarSesion } = useAuth()
const verificando = ref(true)
const { registrar } = useEmbudo()

onMounted(async () => {
  await cargarSesion()
  verificando.value = false
  if (!sesion.value.autenticado) {
    await navigateTo('/registrarse')
  } else {
    registrar('test_inicio')
  }
})
</script>

<template>
  <div v-if="!verificando && sesion.autenticado" class="px-[30px] py-[30px]">
    <h1 class="titulo-seccion mb-[30px] text-center">Cuestionario de Bienestar</h1>
    <TestBienestar />
  </div>
</template>
