<script setup lang="ts">
/**
 * Bandeau de l'accueil : deux grands panneaux côte à côte sur écran large, empilés sur mobile. Voir spec 005, HOM-R3.
 *
 * Chaque panneau est entièrement cliquable : une photo de pagne en fond, un titre en serif et « Découvrir ».
 * Sans photo, le panneau s'affiche sur un fond neutre avec le même titre et le même lien. Les photos sont
 * décoratives (texte alternatif vide) et chargées en priorité : ce sont les premières images visibles.
 *
 * Propriété `images` : les photos du panneau gauche et du panneau droit, ou `null` quand il n'y en a pas.
 */
defineProps<{
  images: readonly [string | null, string | null]
}>()

/** Les deux panneaux : titre affiché et destination. */
const PANELS = [
  { title: 'Les nouveautés', to: '/catalogue?sort=new' },
  { title: 'Tous les dessins', to: '/catalogue' },
] as const
</script>

<template>
  <section aria-label="Mises en avant" class="grid md:grid-cols-2">
    <NuxtLink
      v-for="(panel, index) in PANELS"
      :key="panel.to"
      :to="panel.to"
      :aria-label="`${panel.title}, découvrir`"
      class="relative flex min-h-[60dvh] flex-col items-center justify-end gap-4 overflow-hidden bg-surface-sunken px-4 pb-12 text-center md:min-h-[75dvh]"
      :class="images[index] ? 'text-accent-contrast' : 'text-ink'"
    >
      <template v-if="images[index]">
        <img
          :src="images[index] as string"
          alt=""
          width="600"
          height="600"
          loading="eager"
          fetchpriority="high"
          class="absolute inset-0 size-full object-cover"
        />
        <span class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent" aria-hidden="true" />
      </template>
      <span class="relative font-display text-4xl tracking-display md:text-5xl">{{ panel.title }}</span>
      <span class="relative border-b border-current pb-1 font-sans text-sm uppercase tracking-action">
        Découvrir
      </span>
    </NuxtLink>
  </section>
</template>
