<script setup lang="ts">
/**
 * Message d'erreur annoncé aux lecteurs d'écran (`role="alert"`), avec un bouton pour réessayer.
 * Voir spec 005, HOM-10.
 *
 * Propriété `message` : le texte affiché, en français et sans détail technique.
 * Événement `retry` : émis quand la cliente demande à réessayer.
 */
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div role="alert" class="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center font-sans">
    <p class="font-display text-2xl text-ink">{{ message }}</p>
    <button
      type="button"
      class="inline-flex min-h-11 items-center border border-ink px-8 text-sm uppercase tracking-action text-ink"
      @click="emit('retry')"
    >
      Réessayer
    </button>
  </div>
</template>
