<script setup lang="ts">
/**
 * Page d'accueil de la boutique. Voir spec 005.
 *
 * Fait un seul appel au catalogue (48 cartes, tri par nouveautés) et en déduit le bandeau, les raccourcis, les
 * gammes et la grille « À découvrir ». La page est rendue côté serveur : le contenu arrive avec le HTML.
 * Si le catalogue est en échec, un message et un bouton « Réessayer » remplacent le contenu ; l'en-tête et le pied
 * de page restent affichés. Un catalogue vide affiche « Aucun pagne pour le moment. ».
 */
import HomeHero from '~/components/home/HomeHero.vue'
import HomeShortcuts from '~/components/home/HomeShortcuts.vue'
import NewArrivals from '~/components/home/NewArrivals.vue'
import RangeTiles from '~/components/home/RangeTiles.vue'
import ErrorNotice from '~/components/ui/ErrorNotice.vue'
import { buildHomeContent } from '~/utils/home'

/** Nombre de cartes demandées au catalogue : tout ce dont l'accueil a besoin en un seul appel. */
const CATALOG_LIMIT = 48

const shop = await useShop()
const catalog = useCatalogApi()

const { data: page, error, refresh } = await useAsyncData('home-catalog', () =>
  catalog.list({ limit: CATALOG_LIMIT, sort: 'new' }),
)

/** Contenu de l'accueil déduit du catalogue, ou `null` tant que le catalogue n'est pas disponible. */
const content = computed(() => (page.value === null || page.value === undefined ? null : buildHomeContent(page.value)))

useSeoMeta({
  title: () => (shop.value.tagline === '' ? shop.value.name : `${shop.value.name} — ${shop.value.tagline}`),
  description: () => shop.value.tagline,
})
</script>

<template>
  <div>
    <h1 class="sr-only">{{ shop.name }}</h1>

    <ErrorNotice v-if="error" message="Le catalogue est momentanément indisponible." @retry="refresh()" />

    <p v-else-if="content?.isEmpty" class="px-4 py-24 text-center font-display text-2xl text-ink">
      Aucun pagne pour le moment.
    </p>

    <template v-else-if="content">
      <HomeHero :images="content.heroImages" />
      <HomeShortcuts />
      <RangeTiles :tiles="content.rangeTiles" />
      <NewArrivals :items="content.discover" />
    </template>
  </div>
</template>
