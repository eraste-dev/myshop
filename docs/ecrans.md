# Liste des écrans

Trois applications. Priorité : **P1** = MVP, **P2** = plus tard.

## 1. App client (`client`, web responsive, mobile d'abord)

| Écran | Prio | Scénarios |
|---|---|---|
| Accueil de la boutique (visuel, collections, produits mis en avant) | P1 | S1 |
| Catalogue / collection (filtres, tri) | P1 | S1 |
| Fiche produit : photos avec zoom, prix, disponibilité | P1 | S2 |
| Fiche produit : choix de la pièce (quantité) | P1 | S3 |
| Fiche produit : choix de la mesure, prix calculé, erreurs de longueur | P1 | S4, S5 |
| Produit en rupture ou stock insuffisant | P1 | S6 |
| Panier (modifier, supprimer, total) | P1 | S7 |
| Commande : informations client | P1 | S8 |
| Commande : livraison (zone, frais, zone non desservie) | P1 | S8, S9 |
| Commande : moyen de paiement et récapitulatif | P1 | S10, S12, S13 |
| Paiement en cours / retour de paiement : succès, échec, abandon | P1 | S10, S11 |
| Confirmation de commande | P1 | S10 |
| Commander sur WhatsApp (message prérempli) | P1 | S14 |
| Partager un produit ou la boutique | P1 | S15 |
| Pages : livraison et retours, CGV, à propos, contact | P1 | S16 |
| Boutique introuvable, page 404, erreur | P1 | |
| Visualiseur 3D | P2 | voir [3d.md](3d.md) |
| Compte client, historique | P2 | |

## 2. Back-office de la boutique (`client-admin`)

| Écran | Prio | Scénarios |
|---|---|---|
| Connexion | P1 | A1 |
| Tableau de bord (commandes récentes, stock bas) | P1 | A5 |
| Liste des produits (recherche, filtre, visibilité) | P1 | A4 |
| Création / édition d'un produit à la pièce | P1 | A2 |
| Création / édition d'un produit à la mesure | P1 | A3 |
| Gestion des photos du produit (ordre, photo du motif à plat) | P1 | A2 |
| Collections | P1 | |
| Attributs produit et valeurs (voir [filtres.md](filtres.md)) | P1 | |
| Stock | P1 | A4 |
| Liste des commandes (filtre par statut) | P1 | A5 |
| Détail d'une commande, changement de statut, annulation | P1 | A6, A7 |
| Livraison : zones et tarifs | P1 | A8 |
| Paiement : moyens activés, paiement à la livraison | P1 | A8 |
| Identité de la boutique (nom, logo, couleurs) | P1 | A8 |
| Pages et politiques : éditeur, publication, export | P1 | A9 |
| Clients | P2 | |
| Statistiques de vente | P2 | |

## 3. App générale (`client-platform`)

| Écran | Prio | Scénarios |
|---|---|---|
| Connexion administrateur | P1 | |
| Liste des boutiques | P1 | |
| Détail d'une boutique (statut, propriétaire, options) | P1 | |
| Paramétrage global : moyens de paiement, pays, devises, options autorisées | P1 | P1, P2 |
| Utilisateurs et rôles | P1 | |
| Création guidée d'une boutique, inscription libre | P2 | phase 3 |
| Facturation, abonnements | P2 | phase 3 |

## Transverse
- Navigation, en-tête et pied de page de la boutique (thème de la boutique)
- Écrans d'état : chargement, vide, erreur
- Notifications et confirmations
- Sélecteur de scénario de démonstration (mode mock uniquement)

## Références design : à fournir avant la construction
- [ ] 3 à 5 pages de Vlisco et ce qu'on y retient
- [ ] 3 à 5 pages de Chariow (surtout pour `client-admin` et `client-platform`)
- [ ] Palette, typographie, ton de la boutique de démonstration
