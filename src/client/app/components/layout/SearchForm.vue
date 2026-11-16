<script setup lang="ts">
/**
 * Formulaire de recherche (`role="search"`) de l'en-tête et du menu.
 *
 * Nettoie le texte saisi et émet l'adresse de recherche (`/catalogue?q=…`). Un champ vide ou fait
 * d'espaces n'émet rien. Voir spec 004, LAY-R5.
 *
 * Événement `search` : émis avec l'adresse de recherche quand la cliente valide un texte non vide.
 */
import { ref } from 'vue'
import { searchLocation } from '~/utils/navigation'
import UiIcon from '../ui/UiIcon.vue'

const emit = defineEmits<{
  search: [location: string]
}>()

/** Texte en cours de saisie. */
const term = ref('')

/** Valide la recherche : émet l'adresse si le texte n'est pas vide. */
function submit(): void {
  const location = searchLocation(term.value)
  if (location !== null) emit('search', location)
}
</script>

<template>
  <form role="search" class="flex items-center border-b border-line focus-within:border-ink" @submit.prevent="submit">
    <input
      v-model="term"
      type="search"
      name="q"
      aria-label="Rechercher"
      placeholder="Rechercher"
      enterkeyhint="search"
      autocomplete="off"
      class="h-11 w-full min-w-0 bg-transparent px-1 font-sans text-base text-ink placeholder:text-ink-subtle focus:outline-none"
    />
    <button
      type="submit"
      aria-label="Lancer la recherche"
      class="flex size-11 shrink-0 items-center justify-center text-ink"
    >
      <UiIcon name="search" />
    </button>
  </form>
</template>
