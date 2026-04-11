# showcase_web

Vitrine Next.js pour afficher une galerie d'images issues de `classicGAN`.

## Role

Cette application n'entraine pas le modele et ne lance pas d'inference Python en production.
Elle affiche simplement des images exportees au prealable dans :

```text
public/generated/
```

La liste des images affichees est declaree dans :

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

Le site deploie uniquement la vitrine et les images statiques exportees.
