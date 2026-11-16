# Frontend d'abord, avec mocks

## Objectif
Construire les trois frontends complets, branchés sur des **données simulées**, pour **valider les écrans et les parcours** avant d'écrire le backend. Le choix du langage du backend est repoussé après cette validation.

## Périmètre
- Les trois applications : `client`, `client-admin`, `client-platform` (voir [stack.md](stack.md))
- Tous les écrans listés dans [ecrans.md](ecrans.md)
- Les scénarios de [scenarios.md](scenarios.md) jouables de bout en bout sur les mocks
- Aucun backend, aucune base de données, aucun vrai paiement

## Approche

### Une frontière unique : le client d'API
Les écrans n'appellent jamais directement les mocks. Ils passent par un **client d'API** (une interface par domaine : produits, panier, commandes, paramètres, etc.). Le backend réel remplacera les mocks derrière cette même interface, sans modifier les écrans.

### Mocks au niveau HTTP avec MSW
- **MSW (Mock Service Worker)** intercepte les appels réseau dans le navigateur et dans les tests. Les écrans font de vraies requêtes HTTP, comme avec le futur backend.
- Les mocks vivent dans un paquet dédié du monorepo, partagé par les trois apps.
- Données de démonstration cohérentes : plusieurs boutiques, pagnes à la pièce et à la mesure, stocks variés, commandes dans tous les statuts.
- Un état **modifiable** pendant la session (panier, commandes, stock) pour jouer les parcours, remis à zéro au rechargement ou par un bouton de réinitialisation.

### Contrat de données
- Les types des échanges (produit, commande, boutique, paramètres...) sont écrits à la main dans un paquet partagé. Ils servent de **contrat provisoire**.
- Quand le backend sera choisi, ce contrat devient un document OpenAPI et les types sont générés.
- On ne mock que le **contrat**, pas la logique métier profonde. La réservation de stock, par exemple, est simulée simplement : la vraie règle viendra avec le backend.

## États à couvrir sur chaque écran
- Chargement
- Liste vide
- Erreur (réseau, serveur)
- Rupture de stock, stock insuffisant pour la mesure demandée
- Paiement : réussi, échoué, abandonné, en attente
- Zone de livraison non desservie
- Accès refusé, boutique introuvable

Un sélecteur de scénario de démonstration (réservé au mode mock) permet de forcer ces états sans manipulation.

## Validation des écrans
- Revue écran par écran avec la gérante, sur téléphone
- Tests de parcours Playwright sur les mocks (commander, ajouter un produit...)
- Vérification mobile d'abord et accessibilité (contrastes, clavier)
- Mesure du poids des pages sur connexion lente

## Risques
| Risque | Réponse |
|---|---|
| Les mocks divergent du vrai backend | Contrat de types partagé, mocks limités au contrat, génération OpenAPI dès que le backend est choisi |
| On valide des écrans qui masquent la complexité réelle (paiement, stock) | Scénarios d'échec simulés dès le départ, règles métier listées dans [scenarios.md](scenarios.md) |
| Dérive visuelle sans références | Fixer les références de design (Vlisco, Chariow) avant de construire les écrans |
| Code jetable | Les écrans, composants et jetons de design sont du vrai code conservé. Seuls les mocks sont remplacés. |

## Définition de « terminé » pour cette étape
- Tous les écrans de [ecrans.md](ecrans.md) existent et sont navigables
- Les scénarios S1 à S16 et A1 à A9 sont jouables sur les mocks
- La gérante a validé les parcours sur son téléphone
- La liste des besoins backend (opérations et règles) est déduite des écrans et prête pour choisir le langage
