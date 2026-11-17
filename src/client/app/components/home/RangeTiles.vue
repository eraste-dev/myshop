<script setup lang="ts">
/**
 * Tuiles des gammes de l'accueil : une photo en portrait par gamme, son nom et son nombre de dessins.
 * Voir spec 005, HOM-R4.
 *
 * Chaque tuile mène au catalogue filtré sur la gamme. Le nom étant écrit sous la photo, celle-ci est décorative
 * (texte alternatif vide). La section disparaît quand il n'y a aucune tuile.
 *
 * Propriété `tiles` : les gammes à afficher, déjà ordonnées.
 */
import type { RangeTile } from '@shop-pagne/types'
import { designCountLabel, rangeHref } from '~/utils/catalog-display'

defineProps<{
  tiles: readonly RangeTile[]
}>()
</script>

<template>
  <section v-if="tiles.length > 0" aria-labelledby="gammes-titre" class="mx-auto max-w-screen-2xl px-4 py-12 md:px-6">
    <h2 id="gammes-titre" class="pb-8 font-display text-3xl tracking-display text-ink md:text-4xl">
      Les gammes
    </h2>
    <ul class="grid grid-cols-2 gap-2 md:grid-cols-4">
      <li v-for="tile in tiles" :key="tile.range">
        <NuxtLink :to="rangeHref(tile.range)" class="block">
          <div class="aspect-[4/5] overflow-hidden bg-surface-sunken">
            <img
              :src="tile.image"
              alt=""
              width="600"
              height="750"
              loading="lazy"
              decoding="async"
              class="size-full object-cover"
            />
          </div>
          <p class="pt-3 font-display text-xl text-ink">{{ tile.range }}</p>
          <p class="font-sans text-sm text-ink-muted">{{ designCountLabel(tile.count) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
