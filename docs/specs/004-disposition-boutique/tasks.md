# 004 – Tâches et traçabilité

Statut de la spec : **implémentée**.

## Traçabilité
| Critère | Vérification |
|---|---|
| LAY-1 | `api.test.ts` (mocks), `shop.test.ts` (client) ; `GET /api/shop` répond 200 sur le serveur |
| LAY-2 | `layout-utils.test.ts` (dont l'injection de style refusée), `layout-components.test.ts` (`ShopShell`) |
| LAY-3 à LAY-5 | `layout-components.test.ts` (`SiteHeader`) ; rendu vérifié en navigateur |
| LAY-6 à LAY-8 | `layout-components.test.ts` (`MobileMenu`) ; **Échap, focus piégé, retour du focus, fermeture au choix d'une entrée vérifiés en vrai navigateur** |
| LAY-9, LAY-10 | `layout-utils.test.ts`, `layout-components.test.ts` ; navigateur : `/catalogue?q=wax+bleu` (le `+` équivaut à `%20`), aucune navigation pour un champ vide |
| LAY-11, LAY-12 | `layout-utils.test.ts`, `layout-components.test.ts` (`SiteFooter`) ; lien WhatsApp contrôlé dans le HTML rendu |
| LAY-13 | `layout-components.test.ts` (`SiteFooter`) ; capture d'écran du pied de page |
| LAY-14 | `layout-components.test.ts` (`ShopShell`) ; navigateur : `header`, `nav`, `main`, `footer` présents, lien d'évitement premier élément focalisable |
| LAY-15 | `shop.test.ts` (`resolveShopView` sans boutique), `layout-components.test.ts` (nom par défaut, pas de WhatsApp) |
| LAY-R10 | HTML rendu côté serveur contient en-tête, liens et pied de page (vérifié par requête directe) |
| Pas de défilement horizontal | navigateur à 390 px : `scrollWidth` égal à `clientWidth` |

Tests : types 5, shared 35, mocks 74, client 74 (dont 26 de composants).

## Tâches
- [x] `GET /api/shop`, client `createShopApi`, composable `useShop`
- [x] Utilitaires : `whatsappLink`, `shopThemeStyle`, `searchLocation`, `cartCountDisplay`, `resolveShopView`
- [x] Composants : `UiIcon`, `SearchForm`, `SiteHeader`, `MobileMenu` (Reka UI), `SiteFooter`, `ShopShell`
- [x] Disposition `default.vue`, composable `useCartCount` (0 en attendant le panier)
- [x] Tests de composants (Vue Test Utils + happy-dom)
- [x] Vérification en navigateur : rendu bureau et mobile, clavier et focus, recherche

## Limites connues
- **Le menu et la recherche demandent JavaScript.** Les liens de l'en-tête et du pied de page marchent sans JavaScript (LAY-R10), mais le bouton de menu ne répond qu'une fois la page « hydratée ». Sur une connexion lente, il peut y avoir un court instant où il ne réagit pas.
- LAY-15 (API de la boutique en échec) est vérifié au niveau des fonctions et des composants, pas en navigateur : l'API simulée n'accepte `?scenario=error` que sur l'appel lui-même.
- Les adresses `/catalogue`, `/panier` et `/pages/*` mènent à la page 404 tant que les specs suivantes ne les créent pas.
- Le compteur de panier vaut toujours 0.
- Pas encore de test automatisé en navigateur (Playwright) : les vérifications ci-dessus ont été faites par script, hors dépôt.
