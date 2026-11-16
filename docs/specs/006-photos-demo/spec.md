# 006 – Photos réelles de démonstration

**Code** : `PHO` · **Statut** : validée (délégation) · **Branche** : `feat/demo-photos`
**Voir aussi** : [003](../003-donnees-demo-et-api/spec.md), [design.md](../../design.md), [3d.md](../../3d.md)

## Objectif
Remplacer les motifs générés par de **vraies photos de pagnes** dans la démonstration, sans casser le projet quand aucune photo n'est présente, et préparer le traitement que la gérante utilisera pour ses propres photos.

## Hors périmètre
Téléversement par la gérante dans le back-office (spec ultérieure). Photo du motif à plat pour la 3D (voir 3d.md). Retouche des photos. Format HEIC.

## Principe
```
docs/references/pagnes/*.jpg   (originaux, ignorés par git)
        │  just photos
        ▼
src/client/public/demo/pagnes/<id>.webp          photo de carte (800 px)
src/client/public/demo/pagnes/<id>-zoom.webp     photo de détail (1600 px)
src/packages/mocks/src/fixtures/photos.json      manifeste : fichier, couleur dominante, dimensions
```
Les WebP et le manifeste sont **commités** : ils sont légers et la démonstration fonctionne ainsi sans l'étape de traitement. Les originaux ne le sont jamais.

## Règles
- **PHO-R1** Formats d'entrée acceptés : JPEG, PNG, WebP. Tout autre fichier est ignoré avec un avertissement.
- **PHO-R2** Chaque photo produit **deux** WebP : une photo de carte (côté de 800 px au plus) et une photo de détail (1 600 px au plus). L'image n'est **jamais agrandie** ; l'orientation EXIF est appliquée puis retirée.
- **PHO-R3** **Aucune donnée personnelle ne reste dans les fichiers produits** : les métadonnées (EXIF, position GPS, appareil) sont supprimées.
- **PHO-R4** Le poids est borné : une photo de carte pèse **moins de 150 Ko**, une photo de détail **moins de 400 Ko**. Si ce n'est pas le cas, la qualité baisse jusqu'à y parvenir, avec un plancher de qualité 50 ; en dessous, le script le signale.
- **PHO-R5** L'**identifiant** d'une photo vient de son nom de fichier (minuscules, accents retirés, tirets), sans doublon : `Tissu Bleu (2).JPG` donne `tissu-bleu-2`. Deux fichiers qui donnent le même identifiant reçoivent un suffixe `-2`, `-3`.
- **PHO-R6** La **couleur dominante** est déduite des pixels (en ignorant les pixels très clairs ou très sombres qui sont du fond ou de l'ombre) et ramenée à l'un des noms du catalogue : Bleu, Rouge, Vert, Orange, Jaune, Rose, Noir, Marron, Violet. Elle peut être corrigée à la main dans le manifeste ; une correction manuelle n'est jamais écrasée par un nouveau traitement.
- **PHO-R7** Le traitement est **idempotent** et rapide : une photo déjà traitée et inchangée (même empreinte) n'est pas retraitée.
- **PHO-R8** Le **catalogue de démonstration** se construit à partir du manifeste quand il contient des photos : photos regroupées par 3 (puis 2, puis 1 pour le reste) en dessins, qui reprennent les noms, gammes, styles et modes de vente des descriptions existantes, dans l'ordre. Chaque photo devient un coloris dont le nom de couleur est celui du manifeste.
- **PHO-R9** **Sans photo** (manifeste vide ou absent), le catalogue actuel fait de motifs générés reste en place : le projet démarre toujours.
- **PHO-R10** Les images d'un coloris sont servies par une **adresse statique** (`/demo/pagnes/<id>.webp`), plus de génération à la volée pour les photos réelles.
- **PHO-R11** Le script **n'écrit jamais en dehors** de `public/demo/pagnes/` et du manifeste, et ne lit que le dossier des originaux (pas de chemin fourni par l'extérieur).

## Critères d'acceptation
| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| PHO-1 | un dossier mêlant `.jpg`, `.png`, `.webp`, `.txt` et `.gif` | on lance le traitement | seules les trois premières sortes sont traitées ; `.txt` et `.gif` sont signalés et ignorés |
| PHO-2 | une photo de 4 000 × 3 000 px | on la traite | la carte fait 800 px au plus, le détail 1 600 px au plus, et le rapport hauteur/largeur est conservé |
| PHO-3 | une photo de 500 × 400 px | on la traite | elle n'est pas agrandie |
| PHO-4 | une photo avec position GPS et modèle d'appareil | on lit les fichiers produits | aucune de ces métadonnées n'y figure |
| PHO-5 | une photo très détaillée | on la traite | la carte pèse moins de 150 Ko et le détail moins de 400 Ko |
| PHO-6 | des noms `Tissu Bleu (2).JPG`, `pagne été.png`, `A.jpg` et `a.jpeg` | on calcule les identifiants | `tissu-bleu-2`, `pagne-ete`, `a`, `a-2` |
| PHO-7 | une photo majoritairement bleue sur fond blanc | on déduit sa couleur | `Bleu` |
| PHO-8 | des photos rouge, verte, jaune, noire, violette | on déduit leurs couleurs | `Rouge`, `Vert`, `Jaune`, `Noir`, `Violet` |
| PHO-9 | une couleur corrigée à la main dans le manifeste | on relance le traitement | la correction est conservée |
| PHO-10 | une photo déjà traitée et inchangée | on relance le traitement | elle n'est pas retraitée |
| PHO-11 | un manifeste de 7 photos | on construit le catalogue | 3 dessins : 3 + 3 + 1 coloris, noms et gammes repris des descriptions |
| PHO-12 | un manifeste vide | on construit le catalogue | le catalogue de motifs générés actuel est utilisé |
| PHO-13 | un coloris issu d'une photo | on lit ses images | adresses statiques `/demo/pagnes/<id>.webp` et `…-zoom.webp` |

## Décisions
- Bibliothèque de traitement : **sharp** (rapide, WebP natif, métadonnées maîtrisées). Ajoutée à la racine du monorepo, en dépendance de développement : elle ne part pas en production.
- Nom de couleur par **plus proche voisin dans l'espace Lab** (plus fidèle à l'œil qu'RVB), parmi les neuf couleurs du catalogue.
- Les noms de dessins restent ceux de la démonstration tant que la gérante n'a pas donné les vrais.

## Traçabilité
Voir `tasks.md`.
