<script setup lang="ts">
/**
 * Enveloppe commune de toutes les pages de la boutique : lien d'évitement, en-tête, menu, contenu et pied de page.
 * Voir spec 004. C'est un composant d'affichage pur : il ne charge aucune donnée, la disposition Nuxt lui fournit
 * celles de la boutique.
 *
 * Le thème de la boutique est posé en variables CSS sur l'élément racine (LAY-R2). Le lien d'évitement est le
 * premier élément focalisable de la page (LAY-R9).
 *
 * Propriétés :
 *  - `shopName` : nom de la boutique.
 *  - `tagline` : accroche de la boutique, peut être vide.
 *  - `whatsapp` : lien WhatsApp complet, ou `null` pour ne pas l'afficher.
 *  - `themeStyle` : variables CSS du thème, déjà filtrées.
 *  - `cartCount` : nombre d'articles du panier.
 *  - `year` : année affichée dans le droit d'auteur.
 *
 * Contenu par défaut : le contenu de la page, placé dans l'élément `main`.
 * Événement `search` : adresse de recherche validée depuis l'en-tête ou le menu.
 */
import { ref } from 'vue'
import { FOOTER_LINKS, NAV_ITEMS } from '~/utils/navigation'
import MobileMenu from './MobileMenu.vue'
import SiteFooter from './SiteFooter.vue'
import SiteHeader from './SiteHeader.vue'

defineProps<{
  shopName: string
  tagline: string
  whatsapp: string | null
  themeStyle: Readonly<Record<string, string>>
  cartCount: number
  year: number
}>()

const emit = defineEmits<{
  search: [location: string]
}>()

/** Le menu en tiroir est-il ouvert ? */
const menuOpen = ref(false)
</script>

<template>
  <div class="min-h-dvh bg-surface font-sans text-ink" :style="themeStyle">
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
    >
      Aller au contenu
    </a>

    <SiteHeader
      v-model:menu-open="menuOpen"
      :shop-name="shopName"
      :cart-count="cartCount"
      @search="emit('search', $event)"
    />
    <MobileMenu v-model:open="menuOpen" :items="NAV_ITEMS" @search="emit('search', $event)" />

    <main id="contenu">
      <slot />
    </main>

    <SiteFooter :shop-name="shopName" :tagline="tagline" :whatsapp="whatsapp" :year="year" :links="FOOTER_LINKS" />
  </div>
</template>
