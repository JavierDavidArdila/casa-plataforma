<script setup lang="ts">
const { sesion, cargarSesion, cerrarSesion } = useAuth()

onMounted(() => {
  cargarSesion()
})

async function salir() {
  await cerrarSesion()
  await navigateTo('/')
}
</script>

<template>
  <header
    class="flex flex-wrap items-center gap-4 border-b border-[var(--color-borde)] bg-[var(--color-superficie)] px-6 py-4"
  >
    <div class="flex min-w-[180px] flex-1 items-center gap-2 rounded-full border border-[var(--color-borde)] px-4 py-2 text-sm text-[var(--color-texto-suave)]">
      <IconoNav nombre="buscar" />
      <input
        type="search"
        placeholder="Buscar"
        class="w-full bg-transparent outline-none placeholder:text-[var(--color-texto-suave)]"
      />
    </div>

    <div class="flex items-center gap-4 text-sm">
      <template v-if="sesion.autenticado">
        <span class="text-[var(--color-texto-suave)]">
          Hola{{ sesion.nombre ? `, ${sesion.nombre}` : '' }}<template v-if="sesion.codigoUsuario"> · #{{ sesion.codigoUsuario }}</template>
        </span>
        <NuxtLink to="/contenidos" class="font-medium text-[var(--color-azul)]">Contenidos</NuxtLink>
        <button type="button" class="text-[var(--color-texto-suave)]" @click="salir">Salir</button>
      </template>
      <template v-else>
        <NuxtLink to="/iniciar-sesion" class="flex items-center gap-2 rounded-full border border-[var(--color-borde)] px-4 py-2">
          <IconoNav nombre="persona" />
          Iniciar sesión
        </NuxtLink>
        <NuxtLink to="/registrarse" class="flex items-center gap-2 rounded-full border border-[var(--color-borde)] px-4 py-2">
          <IconoNav nombre="casa" />
          Registrarse
        </NuxtLink>
      </template>
    </div>
  </header>
</template>
