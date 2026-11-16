<script setup lang="ts">
/**
 * Pied de page de la boutique. Voir spec 004, LAY-R7 et LAY-R8.
 *
 * Affiche le nom et l'accroche de la boutique, les liens d'information, un lien WhatsApp (absent quand la
 * boutique n'a pas de numéro valide) et la mention de droit d'auteur.
 *
 * Propriétés :
 *  - `shopName` : nom de la boutique.
 *  - `tagline` : accroche de la boutique, peut être vide.
 *  - `whatsapp` : lien WhatsApp complet, ou `null` pour ne pas l'afficher.
 *  - `year` : année affichée dans le droit d'auteur.
 *  - `links` : liens d'information (livraison, conditions de vente, à propos, contact).
 */
import { computed } from 'vue'
import type { NavLink } from '@shop-pagne/types'
import { copyrightLine } from '~/utils/navigation'
import UiIcon from '../ui/UiIcon.vue'

const props = defineProps<{
  shopName: string
  tagline: string
  whatsapp: string | null
  year: number
  links: readonly NavLink[]
}>()

/** Mention de droit d'auteur : année et nom de la boutique. */
const copyright = computed(() => copyrightLine(props.shopName, props.year))
</script>

<template>
  <footer class="border-t border-line bg-surface font-sans text-ink">
    <div class="mx-auto grid max-w-screen-2xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
      <div class="flex flex-col gap-3">
        <p class="font-display text-3xl tracking-[var(--tracking-display)]">{{ shopName }}</p>
        <p v-if="tagline !== ''" class="max-w-sm text-ink-muted">{{ tagline }}</p>
      </div>

      <nav aria-label="Informations">
        <ul class="flex flex-col gap-3">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" class="inline-block py-1 text-ink underline-offset-4 hover:underline">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div v-if="whatsapp !== null" class="flex flex-col items-start gap-3">
        <a
          :href="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-ink"
        >
          <UiIcon name="whatsapp" />
          <span>Nous écrire sur WhatsApp</span>
        </a>
      </div>
    </div>

    <div class="border-t border-line">
      <p class="mx-auto max-w-screen-2xl px-4 py-4 text-sm text-ink-muted md:px-6">{{ copyright }}</p>
    </div>
  </footer>
</template>
