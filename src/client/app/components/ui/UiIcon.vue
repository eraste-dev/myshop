<script setup lang="ts">
/**
 * Icône de l'interface : petit dessin SVG au trait fin, qui prend la couleur du texte (`currentColor`).
 *
 * L'icône est décorative : elle est masquée aux lecteurs d'écran (`aria-hidden`). Le bouton ou le lien
 * qui la contient doit porter son propre libellé en français.
 *
 * Propriété `name` : l'icône à afficher (`menu`, `search`, `bag`, `close` ou `whatsapp`).
 */
defineProps<{
  name: 'menu' | 'search' | 'bag' | 'close' | 'whatsapp'
}>()
</script>

<template>
  <svg
    class="size-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </template>
    <template v-else-if="name === 'bag'">
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
    <template v-else>
      <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20Z" />
      <path d="M9.4 9.2c.3 2.1 2.2 4 4.4 4.4l1-1.1-1.8-.9-.8.6a4 4 0 0 1-1.4-1.4l.6-.8-.9-1.8-1.1 1Z" />
    </template>
  </svg>
</template>
