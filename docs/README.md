# Docs – Boutique de pagnes

Site e-commerce de vente de pagnes (Côte d'Ivoire), inspiré de l'esthétique de Vlisco.

```
docs/
  README.md        cet index
  produit/         quoi construire, pour qui
  conception/      comment le construire, à quoi ça ressemble
  guide/           règles de travail (à relire avant chaque tâche)
  specs/           une spec par fonctionnalité (SDD + TDD)
  references/      captures de design, usage interne, ignorées par git
```

## produit/
| Fichier | Contenu |
|---|---|
| [mvp.md](produit/mvp.md) | Périmètre du MVP : ce qui est dedans, ce qui est dehors |
| [scenarios.md](produit/scenarios.md) | Scénarios clients et admin, au format simple |
| [ecrans.md](produit/ecrans.md) | Liste des écrans des trois applications |
| [filtres.md](produit/filtres.md) | Attributs produit et filtres du catalogue |
| [plateforme.md](produit/plateforme.md) | Vision multi-boutiques (type Chariow), phases et risques |
| [questions-ouvertes.md](produit/questions-ouvertes.md) | Décisions prises et à prendre avec la mère |

## conception/
| Fichier | Contenu |
|---|---|
| [stack.md](conception/stack.md) | Stack technique, alternatives, coûts, risques |
| [frontend-mocks.md](conception/frontend-mocks.md) | Stratégie : frontends d'abord, avec mocks |
| [design.md](conception/design.md) | Références de design de la vitrine (Vlisco), partiel |
| [3d.md](conception/3d.md) | Visualisation 3D du motif (proposition à valider) |

## guide/
| Fichier | Contenu |
|---|---|
| [conventions.md](guide/conventions.md) | Langue, nommage, code, interface, sécurité, outillage |
| [erreurs-a-eviter.md](guide/erreurs-a-eviter.md) | Erreurs déjà commises et règle pour ne pas les refaire |
| [a-faire.md](guide/a-faire.md) | Listes de contrôle : avant, pendant, « terminé », commit |

## specs/
| Fichier | Contenu |
|---|---|
| [000-conventions.md](specs/000-conventions.md) | Méthode SDD + TDD, modèle de spec, conventions de code |
| [001-mesure](specs/001-mesure/spec.md) | Vente à la mesure |
| [002-client-socle](specs/002-client-socle/spec.md) | Socle de la vitrine |
| [003-donnees-demo-et-api](specs/003-donnees-demo-et-api/spec.md) | Données de démonstration et API du catalogue |
| [004-disposition-boutique](specs/004-disposition-boutique/spec.md) | En-tête, menu et pied de page |
| [005-accueil](specs/005-accueil/spec.md) | Page d'accueil |
| [006-photos-demo](specs/006-photos-demo/spec.md) | Traitement des photos réelles de démonstration |

**Statut** : définition du MVP. La stack technique sera décidée après validation de ce périmètre.

**Principe** : parcours e-commerce classique, on ne réinvente rien.
