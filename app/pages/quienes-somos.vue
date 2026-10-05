<script setup lang="ts">
const intro =
  'Somos los creadores de la metodología de cuidado emocional para quienes cuidan a distancia C.A.S.A. con sus pilares Comprender, Aprender, Sostener y Aliviar, y los productores de la plataforma virtual de educación que inicia su primera temporada.'

useSeoPagina({
  title: 'Quiénes Somos — C.A.S.A.',
  imagen: '/images/figma/hero-quienes-somos.jpg',
  description: intro,
})

// Textos del Word del 30 sep 2026. Solo la foto de Fernando está disponible (del sitio
// ahorasoypapademispapas.com); las demás muestran el avatar genérico hasta que lleguen.
const equipo = [
  {
    nombre: 'Fernando Roca Correa',
    descripcion: 'Cuidador, conferencista, mentor familiar, autor de ¡Ahora soy papá de mis papás! y creador del programa C.A.S.A.',
    foto: '/images/equipo/fernando-roca.jpg',
  },
  { nombre: 'Luz María Arbeláez', descripcion: 'Psicóloga y comunicadora. Asesora científica del programa C.A.S.A.' },
  { nombre: 'Oscar Javier Ávila', descripcion: 'Diseñador gráfico encargado de crear la imagen del proyecto.' },
  { nombre: 'Alejandra Sánchez', descripcion: 'Diseñadora interactiva, creó las animaciones y el material gráfico del programa.' },
]
</script>

<template>
  <div>
    <HeroCasa imagen="/images/figma/hero-quienes-somos.jpg" alt="Quiénes somos" />

    <section class="px-[36px] py-[30px]">
      <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.75]">{{ intro }}</p>
    </section>

    <section class="flex flex-col gap-[40px] border-t border-[#dcdcdc] px-[30px] py-[50px]">
      <div class="grid gap-[40px] sm:grid-cols-2 xl:grid-cols-4">
        <ProfileCard
          v-for="persona in equipo"
          :key="persona.nombre"
          :nombre="persona.nombre"
          :descripcion="persona.descripcion"
          :foto="persona.foto"
        />
      </div>
      <p class="text-[16px] text-[var(--color-gris-dk)] [line-height:1.5]">
        Y otro grupo importante de profesionales del desarrollo interactivo y la producción audiovisual, como David y
        Andrés Hernández.
      </p>
    </section>
  </div>
</template>
