<script setup lang="ts">
useSeoMeta({
  title: 'Quiénes Somos — C.A.S.A.',
  description: 'Conoce al equipo detrás de la Plataforma C.A.S.A., del cuidado a distancia.',
})

// TODO: reemplazar por el equipo real (nombre, cargo, foto, bio corta y link)
// cuando el negocio lo defina — de momento son tarjetas placeholder.
const equipo = Array.from({ length: 7 }, (_, i) => ({
  nombre: `Persona 0${i + 1}`,
  cargo: 'Título persona',
  descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus sodales justo,',
}))
</script>

<template>
  <div class="flex flex-col gap-10 px-6 py-10 md:px-10">
    <section
      class="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-10 text-white"
    >
      <div class="absolute inset-0 bg-[var(--color-azul-alto)]" />
      <img
        src="/images/bio/home-bio.png"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-30"
        loading="lazy"
      />
      <div class="relative flex flex-col gap-2">
        <h1 class="text-3xl font-bold text-[var(--color-naranja)] md:text-4xl">Quiénes somos</h1>
        <p class="text-sm text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </section>

    <p class="max-w-4xl text-sm leading-relaxed text-[var(--color-texto-suave)]">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate ut felis nec fringilla. Aliquam
      orci neque, luctus sed efficitur ut, finibus consequat sem. Curabitur suscipit, arcu fermentum rhoncus
      laoreet, metus quam mattis odio, vel aliquam tellus eros a ante. Mauris ultrices eleifend dolor ut efficitur.
    </p>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProfileCard
        v-for="persona in equipo"
        :key="persona.nombre"
        :nombre="persona.nombre"
        :cargo="persona.cargo"
        :descripcion="persona.descripcion"
      />
    </div>
  </div>
</template>
