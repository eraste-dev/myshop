<script setup lang="ts">
/**
 * Menu principal en tiroir, ouvert depuis le bouton de l'en-tête. Voir spec 004, LAY-R4.
 *
 * Construit sur le dialogue accessible de Reka UI : le focus y est piégé tant qu'il est ouvert, il se ferme
 * avec Échap, par un clic à l'extérieur ou par le bouton de fermeture, et le focus revient au bouton d'ouverture.
 * Choisir une entrée ou lancer une recherche le ferme aussi.
 *
 * Propriétés :
 *  - `open` : le menu est-il ouvert ? (utilisable avec `v-model:open`)
 *  - `items` : entrées de navigation à afficher.
 *
 * Événements :
 *  - `update:open` : demande de changement d'état du menu.
 *  - `search` : adresse de recherche validée par la cliente.
 */
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import type { NavLink } from '@shop-pagne/types'
import UiIcon from '../ui/UiIcon.vue'
import SearchForm from './SearchForm.vue'

defineProps<{
  open: boolean
  items: readonly NavLink[]
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  search: [location: string]
}>()

/** Ferme le menu. */
function close(): void {
  emit('update:open', false)
}

/** Transmet la recherche validée, puis ferme le menu. */
function search(location: string): void {
  emit('search', location)
  close()
}
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-40 bg-ink/40" />
      <DialogContent
        id="menu-principal"
        class="fixed inset-y-0 left-0 z-50 flex w-[min(22rem,90vw)] flex-col gap-8 overflow-y-auto bg-surface p-4 font-sans text-ink"
      >
        <DialogTitle class="sr-only">Menu principal</DialogTitle>
        <DialogDescription class="sr-only">Navigation du site et recherche.</DialogDescription>

        <div class="flex justify-end">
          <DialogClose aria-label="Fermer le menu" class="flex size-11 items-center justify-center text-ink">
            <UiIcon name="close" />
          </DialogClose>
        </div>

        <SearchForm @search="search" />

        <nav aria-label="Menu principal">
          <ul class="flex flex-col">
            <li v-for="item in items" :key="item.to" class="border-b border-line">
              <NuxtLink
                :to="item.to"
                class="block py-4 font-display text-3xl tracking-display text-ink"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
