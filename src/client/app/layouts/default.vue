<template>
  <div class="min-h-dvh bg-surface font-sans text-ink">
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
    >
      Aller au contenu
    </a>
    <main id="contenu">
      <slot />
    </main>
  </div>
</template>
