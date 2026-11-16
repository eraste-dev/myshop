# 002 – Tâches et traçabilité

Statut de la spec : **implémentée**.

| Critère | Vérification |
|---|---|
| CLI-1 | Serveur de production lancé, `GET /` répond 200 (vérifié à la main, à automatiser avec Playwright dans la spec 003) |
| CLI-2 | `pnpm build:client` réussit |
| CLI-3 | `nuxt typecheck` sans erreur (TypeScript 5.9 épinglé dans `src/client` : `vue-tsc` n'est pas compatible avec TypeScript 7) |
| CLI-4 | Test `[CLI-4] ne contient aucune couleur écrite en dur dans app/` |
| CLI-5 | HTML rendu sans aucune référence à un service de polices ; 6 fichiers woff2 servis localement |
| CLI-6 | Test `[CLI-6] déclare la langue française…` + HTML rendu (`lang="fr"`, titre, viewport, lien d'évitement) |
| CLI-7 | Test `[CLI-7] définit les jetons de base dans tokens.css` |
| CLI-R3 | Test `[CLI-R3] charge les polices depuis des paquets locaux…` |

## Tâches
- [x] Paquet `@shop-pagne/client`, configuration Nuxt, Tailwind, polices
- [x] Feuille de style principale important les jetons
- [x] Disposition par défaut avec lien d'évitement
- [x] Page d'accueil vide
- [x] Tests du socle (4), vus en échec avant le code (2 sur 4)
- [x] Build, rendu serveur et types vérifiés

## Dette connue
- `nuxt typecheck` et `nuxt prepare` signalent « 1 open connection » après exécution : le processus peut ne pas se terminer seul en intégration continue. À traiter quand l'intégration continue sera ajoutée.
- CLI-1 et CLI-5 sont vérifiés à la main, sans test automatique.
