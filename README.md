# Ekinox Gamos · site de démonstration

Maquette fonctionnelle du futur site e-commerce d'**Ekinox Gamos**, spécialiste du matériel informatique gaming et professionnel à Antananarivo (showroom à Mahamasina, près de Gastro Pizza, et annexe à l'immeuble Raitra, Andravoahangy).

> Site de démonstration : les prix, stocks, FPS, numéros de série et tickets SAV sont fictifs. Les paiements sont simulés.

## Ce qu'on peut tester

| Page | Ce qu'elle montre |
| --- | --- |
| `index.html` | Accueil en mode **Nuit** (gaming) ou **Jour** (pro), gamme, univers pro, atelier, arrivages, pack anti-délestage |
| `gamme.html` | Gamme Ekinox filtrable par budget, définition et jeu, avec FPS estimés |
| `produit.html?id=zenith` | Fiche PC : stock par boutique, pack anti-délestage, réservation avec acompte, FPS, carnet d'assemblage |
| `configurateur.html` | **Forge** : compatibilité en direct (socket, DDR4/DDR5, format, longueur GPU, puissance), suggestion selon le budget |
| `catalogue.html` | Composants avec recherche tolérante (`rtx5060`, `ddr5`, `1 To`), filtres et catégories |
| `panier.html` | Panier, commande WhatsApp préremplie, livraison, paiement MVola / Orange Money / Airtel Money simulé |
| `pro.html` | Espace pro : univers métier, prix HT/TTC, devis avec NIF et STAT |
| `garantie.html` | Passeport garantie avec QR code, ouverture et suivi de ticket SAV |
| `boutiques.html` | Statut d'ouverture en direct (heure de Tana), horaires, itinéraires |
| `proposition/` | Proposition d'agence (diagnostic, concept, fonctionnalités, planning) |

Numéros de démonstration : passeport `EKG-2026-0412` (sous garantie), `EKG-2025-1187` (expiré), ticket `EKG-SAV-0007`.

## Charte

Couleurs relevées sur le logo : noir `#000000`, jaune `#FEE903`, olive `#969108`. Pas de blanc. Le texte courant utilise un gris chaud `#D6D2B6` pour le confort de lecture. Polices : Orbitron (titres), Barlow (texte), JetBrains Mono (prix et specs).

Le mode **Nuit** garde tout le site en noir. Le mode **Jour** passe l'en-tête et les bandeaux en jaune. Par défaut, le site suit l'heure de Tana (Jour de 6 h à 18 h), et l'espace pro s'ouvre toujours en Jour.

## Lancer en local

Le site est en HTML, CSS et JavaScript, sans compilation. Ouvrir `index.html` dans un navigateur suffit. Pour un rendu identique à GitHub Pages :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Publier sur GitHub Pages

1. Pousser le dépôt sur GitHub (branche `main`).
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est en ligne après une à deux minutes à l'adresse `https://<compte>.github.io/<depot>/`.

## Modifier le contenu

Toutes les données (PC, composants, univers pro, boutiques, horaires, arrivages, passeports de démo) sont dans `assets/js/data.js`. Le numéro WhatsApp de commande est `shop.whatsapp`.

## Crédits

Photos : [Unsplash](https://unsplash.com/license), détail sur `credits.html`. Elles seront remplacées par des photos du showroom et de l'atelier. Logo et bannière © Ekinox Gamos.
