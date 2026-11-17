# Vision plateforme

## Ambition
Au-delà de la boutique de pagnes, construire une plateforme où **n'importe quel commerçant crée sa boutique, la gère seul et la partage sur les réseaux sociaux** (modèle type Chariow).

La boutique de pagnes de la mère est le **premier locataire** (tenant) et le cas d'usage de référence.

## Principe directeur
**Multi-boutiques prêt dès le départ, plateforme complète plus tard.**
On conçoit les données pour plusieurs boutiques dès le premier jour, parce que c'est très coûteux à rajouter après. On ne construit pas les fonctions SaaS (inscription libre, facturation, domaines personnalisés) avant que la boutique de la mère tourne.

## Ce qui doit être multi-boutiques dès le MVP
- Chaque donnée métier appartient à une boutique : produits, commandes, clients, stock, zones de livraison, paramètres, moyens de paiement
- Un utilisateur gérant est rattaché à une ou plusieurs boutiques
- Une boutique ne voit **jamais** les données d'une autre (isolation stricte)
- L'identité visuelle (logo, couleurs, ton) est un paramètre de la boutique, pas du code
- Adresse de la boutique via une URL propre (ex. sous-domaine ou chemin)
- Catalogue générique : produit, variantes, attributs, pour ne pas être limité aux pagnes

## Paramétrage à deux niveaux
1. **Global (plateforme)** : définit ce qui est **autorisé** (moyens de paiement disponibles, pays, devises, modes de vente, options comme le paiement à la livraison).
2. **Boutique** : chaque boutique **choisit et règle** ses options, uniquement parmi ce que le niveau global autorise.

Règle : une boutique ne peut jamais activer une option que le niveau global n'autorise pas. Si le global retire une option, elle est désactivée partout.

## Paramétrable par boutique
- Identité : nom, logo, couleurs
- Pays, devise
- Zones de livraison et tarifs
- Moyens de paiement activés
- Unités et modes de vente
- Pages légales et politiques (retour, livraison), rédigées dans l'app et exportables
- Paiement à la livraison (activé ou non, dans la limite du global)

## Phases

| Phase | Contenu |
|---|---|
| **1 – MVP** | Boutique de la mère, structure multi-boutiques en base, paramétrage par boutique, back-office |
| **2 – Boutique enrichie** | Visualiseur 3D, partage réseaux sociaux, livraison suivie dans l'app |
| **3 – Plateforme** | Inscription libre des commerçants, création de boutique guidée, domaines personnalisés, thèmes, abonnement ou commission |

## Partage sur les réseaux sociaux
- Chaque produit et chaque boutique a un lien propre et partageable
- Aperçu soigné au partage (image, titre, prix) sur WhatsApp, Facebook, Instagram, TikTok
- Bouton « Partager » sur la fiche produit
- Phase 2 : catalogue exporté pour WhatsApp Business et Facebook ou Instagram Shop

## Risques à traiter tôt

### 1. Flux d'argent (le plus important)
Si la plateforme **encaisse l'argent de commerçants tiers**, elle devient intermédiaire de paiement, avec des obligations réglementaires dans la zone UEMOA/BCEAO.
- **Option recommandée** : chaque commerçant branche **son propre compte marchand** chez le prestataire de paiement. L'argent va directement chez lui, la plateforme ne le détient jamais.
- À éviter au début : encaisser pour tout le monde puis reverser (agrément, litiges, fraude).
- À étudier en phase 3 : paiement fractionné (split) proposé par certains prestataires.

### 2. Dérive de périmètre
Une plateforme complète est un très gros projet. Chaque fonction « plateforme » avant la boutique de la mère retarde le lancement. Le MVP reste donc une boutique, avec des fondations multi-boutiques.

### 3. Sécurité et isolation
Avec plusieurs commerçants, une faille d'isolation expose les clients de tous. L'isolation entre boutiques est testée explicitement.

### 4. Support
Des commerçants indépendants généreront des demandes d'aide. À anticiper en phase 3.

### 5. Légal
Conditions d'utilisation de la plateforme, responsabilité sur les produits vendus, données personnelles des clients des commerçants. À cadrer avant la phase 3.
