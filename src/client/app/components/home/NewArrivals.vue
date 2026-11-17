<script setup lang="ts">
/**
 * Section « À découvrir » de l'accueil : une grille de cartes de pagnes et un lien vers tout le catalogue.
 * Voir spec 005, HOM-R2 et HOM-R12.
 *
 * La grille compte 2 colonnes sur mobile, 3 sur tablette et 4 sur écran large.
 *
 * Propriété `items` : les cartes à afficher, déjà choisies et ordonnées.
 */
import type { CatalogItem } from '@shop-pagne/types'
import ProductCard from '../catalog/ProductCard.vue'

defineProps<{
  items: readonly CatalogItem[]
}>()
</script>

<template>
  <section aria-labelledby="decouvrir-titre" class="mx-auto max-w-screen-2xl px-4 py-12 md:px-6">
    <h2 id="decouvrir-titre" class="pb-8 font-display text-3xl tracking-display text-ink md:text-4xl">
      À découvrir
    </h2>
    <ul class="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      <li v-for="item in items" :key="item.colorwayId">
        <ProductCard :item="item" />
      </li>
    </ul>
    <div class="flex justify-center pt-12">
      <NuxtLink
        to="/catalogue"
        class="inline-flex min-h-11 items-center border border-ink px-8 font-sans text-sm uppercase tracking-action text-ink"
      >
        Voir tout le catalogue
      </NuxtLink>
    </div>
  </section>
</template>
