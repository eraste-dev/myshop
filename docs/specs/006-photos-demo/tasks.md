# 006 – Tâches et traçabilité

Statut de la spec : **implémentée**. En attente des vraies photos de la gérante : le dépôt est livré en mode « motifs générés ».

## Traçabilité
| Critère | Vérification |
|---|---|
| PHO-1 | `process.test.ts` : JPEG, PNG, WebP traités ; `.txt` et `.gif` signalés ; `LISEZ-MOI.txt` jamais signalé |
| PHO-2, PHO-3 | `process.test.ts` (`renderWebp`, `processPhotos`) : 4000×3000 → 800×600 et 1600×1200 ; 500×400 jamais agrandi |
| PHO-4 | `process.test.ts` : EXIF et GPS présents en entrée, absents des sorties ; **vérifié aussi sur la ligne de commande** (0 fichier produit contenant la marque de l'appareil) |
| PHO-5, PHO-R4 | `process.test.ts` : budgets 150 Ko et 400 Ko ; baisse de qualité par paliers ; avertissement à la qualité plancher |
| PHO-6, PHO-R11 | `ids.test.ts` : `Tissu Bleu (2).JPG` → `tissu-bleu-2`, accents, doublons, aucun séparateur de chemin ; `process.test.ts` : seuls `sortie/` et `manifest.json` sont écrits, identifiant suspect ignoré au nettoyage |
| PHO-7, PHO-8 | `color.test.ts` (pixels) et `process.test.ts` (photos réelles générées) : Bleu, Rouge, Vert, Jaune, Noir, Violet |
| PHO-9 | `manifest.test.ts` et `process.test.ts` : correction manuelle conservée au retraitement |
| PHO-10 | `process.test.ts` : photo inchangée non retraitée (date du fichier identique), retraitée si ses fichiers produits ont disparu ; **vérifié sur la ligne de commande** (2e passage : 0 traitée, 7 inchangées) |
| PHO-11, PHO-12, PHO-13 | `photo-designs.test.ts` (mocks) : 7 photos → 3 + 3 + 1, 8 → 3 + 3 + 2, noms repris des descriptions, images statiques ; manifeste vide → catalogue généré |

Tests : types 5, shared 35, photos 55, mocks 85, client 120.

## Vérification de bout en bout (avec 7 photos de substitution)
- `just photos` : 7 photos traitées, cartes de 29 à 41 Ko, détails de 64 à 93 Ko (796 Ko au total), photo en portrait 3000×4000 → 600×800.
- Le catalogue passe à 7 coloris, 3 dessins ; toutes les images viennent de `/demo/pagnes` en `image/webp`, aucune n'est cassée ; les couleurs viennent du manifeste.
- Suppression des originaux puis `just photos` : 7 photos retirées, dossier de sortie vidé, manifeste vide, catalogue revenu à 43 coloris.

## Tâches
- [x] Types `PhotoEntry`, `PhotoManifest`, `PhotoOptions`, `PhotosConfig`, `PhotosRunResult`, `RenderedWebp`
- [x] Paquet `@shop-pagne/photos` : identifiants, couleur (espace Lab), manifeste, rendu WebP (sharp), traitement du dossier
- [x] Ligne de commande sans argument, `infra/scripts/photos.sh`, recette `just photos`
- [x] Catalogue de démonstration construit à partir du manifeste, repli sur les motifs générés
- [x] Paquet intégré au test d'architecture (types centralisés, JSDoc)

## Limites connues
- **Couleur des teintes sombres ou désaturées** : un gris-brun foncé peut être classé Marron plutôt que Noir. Les noirs francs sont reconnus ; sinon on corrige à la main dans `photos.json` (`"colorSource": "manual"`).
- Une photo à un seul motif sur fond blanc est supposée bleue, rouge… selon le motif ; une photo de tissu avec beaucoup de blanc dans le dessin peut voir sa couleur déduite des autres teintes.
- HEIC non géré : exporter les photos de l'iPhone en JPEG.
- Les noms de dessins, gammes et styles restent ceux de la démonstration ; ils ne correspondent pas forcément aux photos.
- Photo du motif à plat pour la 3D : pas traitée ici.
