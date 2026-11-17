<script setup lang="ts">
/**
 * Disposition par défaut de toutes les pages de la vitrine.
 *
 * Charge les informations de la boutique (le chargement ne bloque jamais l'affichage : voir `useShop`),
 * le compteur du panier et l'année, puis les confie à `ShopShell`. Une recherche validée dans l'en-tête
 * ou le menu mène à la page du catalogue.
 */
import ShopShell from '~/components/layout/ShopShell.vue'

const shop = await useShop()
const cartCount = useCartCount()
const year = new Date().getFullYear()

/** Mène à la page de résultats d'une recherche. */
async function goToSearch(location: string): Promise<void> {
  await navigateTo(location)
}
</script>

<template>
  <ShopShell
    :shop-name="shop.name"
    :tagline="shop.tagline"
    :whatsapp="shop.whatsapp"
    :theme-style="shop.themeStyle"
    :cart-count="cartCount"
    :year="year"
    @search="goToSearch"
  >
    <slot />
  </ShopShell>
</template>
