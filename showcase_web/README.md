# showcase_web

Vitrine Next.js pour afficher une galerie d'images issues de `classicGAN`.

## Role

Cette application n'entraîne pas le modèle et ne lance pas d'inférence Python en production.
Elle affiche simplement des images exportées au préalable dans :

```text
public/generated/
```

La liste des images affichées est déclarée dans :

```text
data/gallery.js
```

## Lancer en local

```powershell
npm install
npm run dev
```

Puis ouvre :

```text
http://localhost:3000
```

## Ajouter ou renouveler la galerie

Depuis `classicGAN/` :

```powershell
python export_vercel_gallery.py --count 50
```

## Deploiement Vercel

- Root Directory : `showcase_web`
- Framework Preset : `Next.js`
- Environment Variables : aucune

Le site déploie uniquement la vitrine et les images statiques exportées.
