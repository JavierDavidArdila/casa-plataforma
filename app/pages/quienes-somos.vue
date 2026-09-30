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
  <div>
    <section class="p-[30px]">
      <img src="/images/figma/hero-quienes-somos.jpg" alt="Quiénes somos" class="h-[440px] w-full rounded-[30px] object-cover" />
    </section>

    <section class="px-[36px] py-[30px]">
      <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.75]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate ut felis nec fringilla. Aliquam
        orci neque, luctus sed efficitur ut, finibus consequat sem. Curabitur suscipit, arcu fermentum rhoncus
        laoreet, metus quam mattis odio, vel aliquam tellus eros a ante. Mauris ultrices eleifend dolor ut efficitur.
      </p>
    </section>

    <section class="border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <div class="grid gap-[40px] sm:grid-cols-2 xl:grid-cols-3">
        <ProfileCard
          v-for="persona in equipo"
          :key="persona.nombre"
          :nombre="persona.nombre"
          :cargo="persona.cargo"
          :descripcion="persona.descripcion"
        />
      </div>
    </section>
  </div>
</template>
