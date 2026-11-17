<script setup lang="ts">
/**
 * Carte d'un pagne dans une liste (accueil, catalogue) : photo carrée, étiquettes, gamme, référence et prix.
 * Voir spec 005, HOM-R5 à HOM-R9.
 *
 * Toute la carte est un lien vers la fiche du coloris. Un coloris indisponible reste visible : sa photo et son
 * prix sont atténués et la mention « Épuisé » apparaît. La photo a des dimensions déclarées (pas de saut de mise
 * en page) et se charge à la demande.
 *
 * Propriété `item` : la carte du catalogue à afficher.
 */
import { computed } from 'vue'
import type { CatalogItem } from '@shop-pagne/types'
import { badgeLabel, itemImageAlt, itemPriceLabel, productHref, visibleBadges } from '~/utils/catalog-display'

const props = defineProps<{
  item: CatalogItem
}>()

/** Adresse de la fiche du coloris. */
const href = computed(() => productHref(props.item))

/** Étiquettes affichées : deux au plus, par ordre d'importance. */
const badges = computed(() => visibleBadges(props.item.badges))

/** Prix mis en forme selon le mode de vente. */
const price = computed(() => itemPriceLabel(props.item))

/** Texte alternatif de la photo. */
const imageAlt = computed(() => itemImageAlt(props.item))
</script>

<template>
  <article data-testid="product-card">
    <NuxtLink :to="href" class="block">
      <div class="relative aspect-square overflow-hidden bg-surface-sunken">
        <img
          :src="item.image"
          :alt="imageAlt"
          width="600"
          height="600"
          loading="lazy"
          decoding="async"
          class="size-full object-cover"
          :class="item.available ? '' : 'opacity-50'"
        />
        <ul v-if="badges.length > 0" class="absolute left-2 top-2 flex flex-col items-start gap-1">
          <li v-for="badge in badges" :key="badge">
            <span
              data-testid="badge"
              class="block bg-surface px-2 py-1 font-sans text-xs uppercase tracking-label text-ink"
            >
              {{ badgeLabel(badge) }}
            </span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-1 pt-3 font-sans">
        <p class="text-xs uppercase tracking-label text-ink">{{ item.range }}</p>
        <p class="text-sm text-ink-muted">{{ item.reference }}</p>
        <p data-testid="price" class="text-base" :class="item.available ? 'text-ink' : 'text-ink-subtle'">{{ price }}</p>
        <p v-if="!item.available" class="text-xs uppercase tracking-label text-ink-muted">Épuisé</p>
      </div>
    </NuxtLink>
  </article>
</template>
