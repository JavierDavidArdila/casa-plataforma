<template>
  <div class="flex min-h-screen bg-[var(--color-fondo)]">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
