# MVP

## Objectif
Lancer la boutique de pagnes de la mère en Côte d'Ivoire, **sur des fondations multi-boutiques** (voir [plateforme.md](plateforme.md)).

## Utilisateurs
- **Cliente** : visiteuse, majoritairement sur smartphone.
- **Gérante** : gère sa boutique seule, sans aide technique.

## Dans le MVP

### Côté cliente
1. Page d'accueil (visuel fort, collections)
2. Catalogue avec filtres simples (collection, couleur, prix) et tri
3. Fiche produit : photos avec zoom, description, prix, disponibilité, choix de la pièce ou de la mesure
4. Panier
5. Commande en invitée (sans compte obligatoire)
6. Paiement : Mobile Money et cartes de l'espace UEMOA/BCEAO
7. Confirmation de commande
8. Contact et commande via WhatsApp
9. Partage d'un produit ou de la boutique (lien propre, aperçu soigné)
10. Pages statiques : à propos, livraison et retours, contact, CGV

### Côté gérante
1. Connexion sécurisée
2. Créer, modifier, masquer un produit (photos, prix, mode de vente, stock)
3. Liste des commandes avec changement de statut
4. Gestion du stock
5. **Paramètres de la boutique** : identité (nom, logo, couleurs), pays et devise, zones et tarifs de livraison, moyens de paiement et paiement à la livraison (parmi ce que le global autorise)
6. **Éditeur de pages et politiques** (retours, livraison, CGV) : rédaction directement dans l'app, publication sur la boutique, export

### Paramétrage global (équipe plateforme)
- Liste des moyens de paiement, pays, devises et options autorisés
- Les boutiques choisissent uniquement parmi cette liste

### Fondations plateforme
- Données rattachées à une boutique, isolation stricte entre boutiques
- Catalogue générique (pas limité aux pagnes)
- Identité visuelle et paramètres pilotés par la boutique, pas par le code

## Hors MVP
- Inscription libre de commerçants, abonnement, facturation (phase 3)
- Domaines personnalisés, thèmes (phase 3)
- Visualiseur 3D (voir [3d.md](3d.md))
- Suivi de livraison dans l'app (v2)
- Comptes clients, promos, avis, wishlist
- Multi-langue
- Application mobile

## Modes de vente

Chaque produit a un mode de vente choisi par la gérante :

| Mode | Fonctionnement | Exemple |
|---|---|---|
| **À la pièce** | Le client choisit une quantité entière. Prix fixe par pièce. | Pagne de 6 yards vendu entier |
| **À la mesure** | Le client choisit une longueur dans des limites. Prix = prix unitaire × longueur. | 2,5 yards d'un wax |

Paramètres du mode « à la mesure » : unité (yard ou mètre), longueur minimale, longueur maximale, pas de découpe.

### Stock
- Mode pièce : le stock compte des pièces.
- Mode mesure : le stock compte la longueur disponible (ex. rouleau de 40 yards). Chaque commande la réduit de la longueur commandée.
- Le stock est **limité et configurable**, il s'épuise automatiquement à chaque commande payée. Quand il atteint zéro, le produit passe en rupture.

## Particularités pagnes
- **Photos du motif** : plusieurs vues, zoom, nom ou référence du motif, plus une photo du motif à plat réservée à la 3D.
- **3D** : visualiseur par texture sur formes prêtes, voir [3d.md](3d.md) (phase à valider).

## Livraison
- Zones et tarifs configurables par boutique et par pays.
- La livraison s'organise **par téléphone, hors application**. L'app marque seulement la commande « en cours de livraison » puis « livrée ».

## Statuts de commande
`En attente de paiement` → `Payée` → `En préparation` → `En cours de livraison` → `Livrée`
Branches : `Annulée`, `Remboursée`.

## Critères de réussite
- Une cliente peut commander et payer depuis son téléphone en moins de 3 minutes.
- La gérante ajoute un produit en moins de 5 minutes, seule.
- Le site se charge correctement sur une connexion mobile moyenne.
- Aucune commande ne dépasse le stock disponible.
- Une boutique ne peut accéder à aucune donnée d'une autre boutique.
