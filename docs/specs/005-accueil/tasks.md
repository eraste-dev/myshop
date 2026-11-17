# 005 – Tâches et traçabilité

Statut de la spec : **implémentée**.

## Traçabilité
| Critère | Vérification |
|---|---|
| HOM-1 | `home.test.ts` : nouveautés, puis disponibles, puis le reste, 8 au plus, ordre du catalogue conservé |
| HOM-2, HOM-3 | `home.test.ts` (images du bandeau, repli), `home-components.test.ts` (`HomeHero`, avec et sans image) |
| HOM-4 | `home.test.ts` (tuiles, ordre alphabétique, gamme sans coloris ignorée), `home-components.test.ts` (`RangeTiles`), `catalog-display.test.ts` |
| HOM-5, HOM-R6 | `catalog-display.test.ts` (`formatXof`, `itemPriceLabel`), `home-components.test.ts` ; prix relevés dans le navigateur |
| HOM-6, HOM-R8 | `catalog-display.test.ts` (`visibleBadges`, `badgeLabel`), `home-components.test.ts` (`ProductCard`) |
| HOM-7 | `home-components.test.ts` : « Épuisé » et prix atténué ; 1 carte épuisée repérée dans le navigateur |
| HOM-8 | `catalog-display.test.ts` (`productHref`), `home-components.test.ts` |
| HOM-9, HOM-R9 | `home-components.test.ts` (texte alternatif, dimensions, chargement) ; navigateur : 0 image sans dimensions, 0 image cassée, bandeau `eager` + `fetchpriority=high` |
| HOM-10 | `home-components.test.ts` (`ErrorNotice` : alerte et bouton « Réessayer ») — **non vérifié en navigateur** |
| HOM-11 | `home.test.ts` (`isEmpty`) — **message non vérifié en navigateur** |
| HOM-12, HOM-R10 | navigateur : un seul `h1`, `h2` « Les gammes » et « À découvrir » |
| HOM-13, HOM-R11 | navigateur : titre « Boutique de pagnes — Pagnes et wax, choisis avec soin », description reprise de l'accroche |
| HOM-R12 | navigateur à 390 px : 2 colonnes, aucun défilement horizontal |
| Console | aucune erreur ni avertissement dans la console |

Tests : types 5, shared 35, mocks 74, client 120.

## Tâches
- [x] Types `RangeTile`, `HomeContent` dans `@shop-pagne/types`
- [x] `catalog-display` : prix, étiquettes, adresses, texte alternatif ; `home` : contenu de la page
- [x] Composants : `ProductCard` (partagé avec le futur catalogue), `HomeHero`, `HomeShortcuts`, `RangeTiles`, `NewArrivals`, `ErrorNotice`
- [x] Page `index.vue` : un appel au catalogue, titre et description, états d'erreur et de catalogue vide
- [x] Voile en dégradé sous le titre du bandeau (contraste)
- [x] Classes d'interlettrage alignées sur les jetons (`tracking-display`, `tracking-label`, `tracking-action`)

## Limites connues
- **Les états d'erreur et de catalogue vide ne sont pas vérifiés dans un vrai navigateur** : la page n'envoie pas `?scenario=error` à l'API simulée. À couvrir avec Playwright (stub de la requête `/api/catalog`).
- Les liens `/catalogue`, `/produits/…` et `/panier` mènent à la page 404 tant que leurs specs ne sont pas faites.
- Les photos sont des motifs générés ; les gammes et les prix sont des données de démonstration.
- Pas de texte éditorial (histoire de la boutique, lookbook) : voir la section « Hors périmètre » de la spec.
