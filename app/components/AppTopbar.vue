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
  <header class="flex h-[100px] flex-wrap items-center justify-between gap-4 px-[30px]">
    <label
      class="flex w-full max-w-[430px] items-center justify-between rounded-[20px] border border-[var(--color-gris-md)] px-[20px] py-[10px]"
    >
      <input
        type="search"
        placeholder="Buscar"
        aria-label="Buscar"
        class="w-full bg-transparent text-[12px] leading-none text-[var(--color-gris-dk)] outline-none placeholder:text-[var(--color-gris-md)]"
      />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gris-md)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m20 20-4.5-4.5" />
      </svg>
    </label>

    <div class="flex items-center">
      <template v-if="sesion.autenticado">
        <span class="px-[30px] text-[16px] font-semibold leading-none text-black">
          Hola{{ sesion.nombre ? `, ${sesion.nombre}` : '' }}<template v-if="sesion.codigoUsuario"> · #{{ sesion.codigoUsuario }}</template>
        </span>
        <NuxtLink to="/contenidos" class="px-[30px] py-[10px] text-[16px] font-semibold leading-none text-[var(--color-secundario)]">
          Contenidos
        </NuxtLink>
        <button type="button" class="px-[30px] py-[10px] text-[16px] font-semibold leading-none text-black" @click="salir">
          Salir
        </button>
      </template>
      <template v-else>
        <NuxtLink to="/iniciar-sesion" class="flex items-center gap-[10px] px-[30px] py-[10px]">
          <span class="flex size-[38px] items-center justify-center rounded-[35px] border border-[var(--color-gris-md)] text-[var(--color-gris-dk)]">
            <IconoNav nombre="persona" :size="20" />
          </span>
          <span class="text-[16px] font-semibold leading-none text-black">Iniciar sesión</span>
        </NuxtLink>
        <NuxtLink to="/registrarse" class="flex items-center gap-[10px] px-[30px] py-[10px]">
          <span class="flex size-[38px] items-center justify-center rounded-[35px] border border-[var(--color-gris-md)] text-[var(--color-gris-dk)]">
            <IconoNav nombre="casa" :size="20" />
          </span>
          <span class="text-[16px] font-semibold leading-none text-black">Registrarse</span>
        </NuxtLink>
      </template>
    </div>
  </header>
</template>
