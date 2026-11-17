<script setup lang="ts">
/**
 * Raccourcis de l'accueil : trois liens vers les listes du catalogue les plus demandées. Voir spec 005.
 *
 * Ils tiennent sur une ligne qui défile horizontalement sur petit écran, sans retour à la ligne.
 */

/** Raccourcis proposés : libellé et destination. */
const SHORTCUTS = [
  { label: 'Nouveautés', to: '/catalogue?sort=new' },
  { label: 'Tous les dessins', to: '/catalogue' },
  { label: 'Disponibles maintenant', to: '/catalogue?availableOnly=true' },
] as const
</script>

<template>
  <nav aria-label="Raccourcis" class="border-b border-line">
    <ul class="mx-auto flex max-w-screen-2xl gap-6 overflow-x-auto px-4 md:justify-center md:px-6">
      <li v-for="shortcut in SHORTCUTS" :key="shortcut.to" class="shrink-0">
        <NuxtLink
          :to="shortcut.to"
          class="block py-4 font-sans text-sm uppercase tracking-action text-ink underline-offset-8 hover:underline"
        >
          {{ shortcut.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
