# Décisions et questions ouvertes

Légende : ✅ décidé · ❓ à trancher · ⏳ reporté

## Produit

| Sujet | Statut | Décision |
|---|---|---|
| Unité de vente | ✅ | Vente **à la pièce**, ou **à la mesure** que le client configure avant de commander. Voir « Modes de vente » dans [mvp.md](mvp.md). |
| Nombre de références | ✅ | Sans importance. Données de test fictives pour le développement. |
| Stock | ✅ | **Limité, configurable** dans le back-office, décrémenté automatiquement à chaque commande. |
| Types de produits | ✅ | Pagnes uniquement pour l'instant, **modèle de données générique** pour évoluer. |
| Photos | ✅ | Existantes, à retravailler au niveau de qualité du site. |
| Limites de la mesure | ✅ | Longueur minimale, maximale et pas de découpe **configurables par produit**. |

## Livraison

| Sujet | Statut | Décision |
|---|---|---|
| Zones | ✅ | Abidjan, Grand-Abidjan, Grand-Bassam au départ. **Configurable par boutique et par pays.** |
| Tarifs | ✅ | Configurables par zone. |
| Exécution | ✅ | **Hors application** (organisée par téléphone). L'app marque seulement la commande « en cours de livraison ». Suivi intégré en v2. |
| Retours et échanges | ✅ | Politique à définir avec le temps. **Rédigée et modifiée directement dans l'app par la gérante, puis exportable.** Format d'export à choisir (PDF, impression, lien public). |

## Paiement

| Sujet | Statut | Décision |
|---|---|---|
| Moyens | ✅ | Ceux disponibles dans l'espace UEMOA/BCEAO (Mobile Money, cartes). |
| Prestataire | ❓ | À choisir quand on définira la stack : un agrégateur couvrant plusieurs pays et opérateurs. |
| Compte marchand | ❓ | Chaque boutique branche son propre compte (recommandé), voir [plateforme.md](plateforme.md). |
| Paiement à la livraison | ✅ | **Paramétrable par boutique**, dans la limite de ce que le **paramétrage global** de la plateforme autorise. |

## Marque et design

| Sujet | Statut | Décision |
|---|---|---|
| Nom, domaine | ⏳ | Pas de marque pour l'instant. |
| Logo, couleurs, ton | ✅ | Configurables par boutique. |
| Inspiration | ✅ | Vlisco, dans son ensemble. À préciser en amont du design (voir « Références »). |

## Légal
- ⏳ Statut de l'activité et mentions légales : à créer après.
- ⏳ CGV, confidentialité : modèles à rédiger.
- ❓ Conditions d'utilisation de la plateforme : avant la phase 3.

## Plateforme
- ✅ Vision multi-boutiques : voir [plateforme.md](plateforme.md).
- ❓ Modèle économique de la plateforme (abonnement, commission, gratuit) : avant la phase 3.
- ❓ Public cible des futurs commerçants (pagnes uniquement, mode, tous produits) ?

## Références
- ❓ Lister 3 à 5 pages précises de Vlisco et de Chariow, et ce qu'on y retient (accueil, fiche produit, back-office...).
