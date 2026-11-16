<script setup lang="ts">
/**
 * En-tête de la boutique, collé en haut de la page. Voir spec 004, LAY-R3 et LAY-R6.
 *
 * À gauche le bouton de menu (et, sur écran large, la recherche), au centre le nom de la boutique
 * en lien vers l'accueil, à droite le panier avec son compteur.
 *
 * Propriétés :
 *  - `shopName` : nom de la boutique, affiché au centre.
 *  - `cartCount` : nombre d'articles du panier ; la pastille n'apparaît qu'au-dessus de zéro.
 *  - `menuOpen` : le menu est-il ouvert ? Sert à `aria-expanded` du bouton de menu.
 *
 * Événements :
 *  - `update:menuOpen` : demande d'ouverture du menu (valeur `true`).
 *  - `search` : adresse de recherche validée par la cliente.
 */
import { computed } from 'vue'
import { cartCountDisplay } from '~/utils/navigation'
import UiIcon from '../ui/UiIcon.vue'
import SearchForm from './SearchForm.vue'

const props = defineProps<{
  shopName: string
  cartCount: number
  menuOpen: boolean
}>()

const emit = defineEmits<{
  'update:menuOpen': [open: boolean]
  search: [location: string]
}>()

/** Pastille et libellé accessible du panier, selon le nombre d'articles. */
const cart = computed(() => cartCountDisplay(props.cartCount))
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-line bg-surface">
    <div class="mx-auto grid h-16 max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 md:px-6">
      <div class="flex min-w-0 items-center gap-4">
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-controls="menu-principal"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          class="flex size-11 shrink-0 items-center justify-center text-ink"
          @click="emit('update:menuOpen', true)"
        >
          <UiIcon name="menu" />
        </button>
        <SearchForm class="hidden w-56 md:flex" @search="emit('search', $event)" />
      </div>

      <NuxtLink
        to="/"
        class="truncate px-2 text-center font-display text-2xl tracking-display text-ink md:text-3xl"
      >
        {{ shopName }}
      </NuxtLink>

      <div class="flex justify-end">
        <NuxtLink to="/panier" :aria-label="cart.label" class="relative flex size-11 items-center justify-center text-ink">
          <UiIcon name="bag" />
          <span
            v-if="cart.badge !== null"
            data-testid="cart-badge"
            aria-hidden="true"
            class="absolute right-0 top-1 min-w-5 bg-accent px-1 text-center font-sans text-[11px] leading-5 text-accent-contrast"
          >
            {{ cart.badge }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
