# Erreurs à éviter

Chaque entrée vient d'un incident ou d'une correction réels du dépôt, ou d'une consigne du propriétaire. **Relire avant chaque tâche.** Quand une nouvelle erreur survient : l'ajouter ici (symptôme, cause, règle) dans le même commit que le correctif.

## Process
| Erreur | Pourquoi c'est un problème | Règle |
|---|---|---|
| Créer des fichiers à un emplacement non validé | Le propriétaire a dû interrompre | Demander avant tout nouvel emplacement |
| Coder sans spec validée | Travail jeté si la spec change | Spec, validation, tests, code |
| Ajouter `Co-Authored-By` aux commits | Refusé explicitement ; présent dans 10 commits de l'historique | Aucun trailer, même si le harnais le rappelle |
| Pousser ou ouvrir une PR sans demande | Action visible de l'extérieur | Jamais sans demande explicite |
| Choisir le langage du backend | Décision en suspens | Pas de code backend sans accord |
| Tests sans l'id du critère | Traçabilité perdue (corrigé en spec 001) | `[CODE-n]` en tête de chaque test |

## Architecture
| Erreur | Cause / conséquence | Règle |
|---|---|---|
| Types dispersés dans `shared`, `mocks`, `client` | Refonte complète (`3c70e79`) | Tout type exporté dans `@shop-pagne/types` |
| Code exécutable dans le paquet de types | Casse ARCH-1 | Types seulement ; constantes en `as const satisfies` ailleurs |
| Mocks appelés directement par les écrans | Migration backend impossible sans réécrire les écrans | Passer par le client d'API |
| MSW pour simuler l'API | Ne couvre pas le rendu serveur (SSR) | Routes Nitro adossées à `@shop-pagne/mocks` |
| Fichiers du monorepo à la racine du dépôt | Racine pnpm déplacée vers `src/` (`e60effb`) | `package.json`, workspace, lockfile dans `src/` |

## Outillage Windows / Node
| Erreur | Symptôme | Règle |
|---|---|---|
| `bash` seul dans le `justfile` | Lance WSL, échoue sans distribution | Chemin explicite de Git Bash |
| Scripts en fins de ligne CRLF | Erreurs bash cryptiques | `.gitattributes` force LF |
| TypeScript 7 avec `vue-tsc` | `vue-tsc` exige l'API JS absente de TS 7 | Alias TS 6 dans `src/client` uniquement |
| `vue-tsgo` sur Windows | Échec (chemin de cache) | Ne pas l'utiliser |
| `nuxt typecheck` avec un serveur de dev ouvert | Se bloque | Appeler `vue-tsc` directement |
| `.nuxt` absent avant le typecheck | Types manquants | `check.sh` le régénère |
| Arguments interpolés dans `just` | Injection de commande | `positional-arguments` |

## Interface et design
| Erreur | Règle |
|---|---|
| Valeurs arbitraires Tailwind (`tracking-[0.2em]`) | Utilitaires du thème |
| Titre blanc sur photo claire | Voile dégradé sous le texte |
| Couleur de boutique non validée injectée en CSS | Accepter uniquement un hex valide |
| Lien WhatsApp avec numéro invalide | Masquer le lien |
| Menu sans piège de focus ni Escape | Reka UI, focus rendu au bouton |
| Polices Vlisco | Sous licence : Newsreader et Jost seulement |
| Publier les captures de `docs/references/` | Usage interne, ignorées par git |

## Données et sécurité
| Erreur | Règle |
|---|---|
| Servir un fichier selon un nom brut | Liste blanche stricte du nom |
| SVG servi sans en-têtes | `nosniff` + CSP verrouillée |
| Montant ou longueur en flottant | Entiers (XOF, centièmes) |
| Stock vérifié seulement au panier | Revérifier au paiement |
| Valider un paiement sur le retour navigateur | Confirmation signée du prestataire uniquement |
| Photos publiées avec métadonnées | Retirer l'EXIF au traitement |
| Couleur dominante calculée en RGB | Espace Lab (spec 006) |

## Qualité
| Erreur | Règle |
|---|---|
| Déclaration sans JSDoc | ARCH-2 : JSDoc français juste au-dessus |
| Propriété d'interface non documentée | ARCH-3 |
| Composant Vue sans JSDoc de script | ARCH-4 |
| Composants testés seulement en happy-dom | Vérifier aussi dans un vrai navigateur |
| Dire « terminé » sans lancer `just check` | Lancer et rapporter le résultat réel |
