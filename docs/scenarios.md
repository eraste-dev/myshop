# Scénarios

Format : **Étant donné** (contexte) / **Quand** (action) / **Alors** (résultat attendu).

## Cliente

### S1 – Parcourir le catalogue
- Étant donné que je suis sur l'accueil d'une boutique
- Quand j'ouvre une collection ou le catalogue
- Alors je vois les pagnes avec photo, nom et prix, et je peux filtrer et trier

### S2 – Voir un produit
- Étant donné que j'ouvre une fiche produit
- Quand je regarde les photos
- Alors je peux zoomer, voir le prix, la disponibilité et le mode de vente

### S3 – Ajouter une pièce au panier
- Étant donné un produit vendu à la pièce et disponible
- Quand je choisis une quantité et clique sur « Ajouter au panier »
- Alors le panier se met à jour, sans dépasser le stock

### S4 – Choisir une mesure
- Étant donné un produit vendu à la mesure
- Quand je saisis une longueur
- Alors le prix se calcule (prix unitaire × longueur) et la longueur doit respecter minimum, maximum et pas de découpe du produit

### S5 – Mesure invalide
- Étant donné un produit vendu à la mesure
- Quand je saisis une longueur hors limites ou hors pas de découpe
- Alors un message clair m'indique les valeurs acceptées et je ne peux pas ajouter au panier

### S6 – Produit indisponible
- Étant donné un produit en rupture ou dont le stock est inférieur à la longueur demandée
- Quand j'ouvre sa fiche ou que je saisis la longueur
- Alors « Ajouter au panier » est désactivé et la raison est indiquée

### S7 – Modifier le panier
- Étant donné un panier avec des articles
- Quand je change une quantité ou une longueur, ou supprime un article
- Alors le total est recalculé, dans les limites du stock

### S8 – Commander sans compte
- Étant donné un panier non vide
- Quand je renseigne nom, téléphone, zone et adresse de livraison
- Alors je vois le récapitulatif avec frais de livraison de ma zone et total

### S9 – Zone non desservie
- Étant donné que ma zone n'est pas configurée dans la boutique
- Quand je saisis mon adresse
- Alors un message m'indique que la livraison n'y est pas disponible

### S10 – Payer en ligne
- Étant donné un récapitulatif validé
- Quand je choisis un moyen de paiement proposé par la boutique et confirme
- Alors la commande passe à « Payée » après confirmation du prestataire, et je reçois une confirmation

### S11 – Paiement échoué ou abandonné
- Étant donné un paiement en cours
- Quand il échoue ou que je l'abandonne
- Alors la commande reste « En attente de paiement », je peux réessayer, et le stock n'est pas perdu définitivement

### S12 – Payer à la livraison
- Étant donné une boutique qui a activé le paiement à la livraison
- Quand je choisis cette option
- Alors la commande est enregistrée « En attente de paiement » et la gérante est notifiée

### S13 – Option de paiement non proposée
- Étant donné une boutique qui n'a pas activé le paiement à la livraison
- Quand j'arrive à l'étape de paiement
- Alors cette option n'apparaît pas

### S14 – Contacter via WhatsApp
- Étant donné n'importe quelle page produit
- Quand je clique sur « Commander sur WhatsApp »
- Alors WhatsApp s'ouvre avec un message prérempli (produit, quantité ou longueur)

### S15 – Partager
- Étant donné une fiche produit ou la boutique
- Quand je clique sur « Partager »
- Alors je peux envoyer un lien propre, qui s'affiche avec une image, un titre et un prix soignés sur WhatsApp et les réseaux

### S16 – Lire les politiques
- Étant donné une boutique avec ses politiques publiées
- Quand j'ouvre « Livraison et retours » ou les CGV
- Alors je lis le texte rédigé par la gérante

## Gérante

### A1 – Se connecter
- Quand je saisis mes identifiants
- Alors j'accède à l'espace de ma boutique, et à aucune autre

### A2 – Ajouter un pagne à la pièce
- Quand je renseigne nom, photos, prix, stock en pièces, collection
- Alors le produit apparaît sur le site

### A3 – Ajouter un pagne à la mesure
- Quand je choisis le mode « à la mesure » et renseigne unité, prix unitaire, longueur minimale, maximale, pas de découpe et stock en longueur
- Alors le produit est vendable à la mesure avec ces contraintes

### A4 – Modifier ou masquer un pagne
- Quand je change prix, stock, limites ou visibilité
- Alors le site reflète le changement

### A5 – Voir les nouvelles commandes
- Quand une commande est passée
- Alors elle apparaît dans la liste avec client, articles, montant et statut de paiement

### A6 – Faire avancer une commande
- Quand je change le statut (préparation, en cours de livraison, livrée)
- Alors le statut est enregistré (la livraison elle-même se gère par téléphone, hors app)

### A7 – Annuler une commande
- Quand j'annule une commande non livrée
- Alors elle passe à « Annulée » et le stock est remis

### A8 – Régler ma boutique
- Quand je modifie identité, zones et tarifs de livraison, moyens de paiement
- Alors la boutique est mise à jour, et je ne peux choisir que les options que la plateforme autorise

### A9 – Rédiger une politique
- Quand j'ouvre l'éditeur de pages et rédige ma politique de retours
- Alors je peux l'enregistrer, la publier sur la boutique et l'exporter

## Administrateur plateforme

### P1 – Définir les options autorisées
- Quand je configure la liste globale (moyens de paiement, pays, devises, options)
- Alors les boutiques ne peuvent choisir que parmi cette liste

### P2 – Retirer une option
- Quand je retire une option autorisée
- Alors elle est désactivée dans toutes les boutiques qui l'utilisaient

## Règles transverses
- Le stock est vérifié au moment du paiement, pas seulement à l'ajout au panier.
- Un paiement n'est valide qu'après confirmation du prestataire de paiement, jamais sur la seule foi du navigateur du client.
- Une boutique ne peut lire ni modifier les données d'une autre boutique.
- Le site est conçu mobile d'abord.
- Les données clientes (téléphone, adresse) ne sont visibles que de la gérante de la boutique concernée.
