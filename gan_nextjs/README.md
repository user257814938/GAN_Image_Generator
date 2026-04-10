# classicGAN Next.js Showcase

Interface Next.js statique prete pour Vercel.

## Objectif

Cette app ne lance pas Python en production. Elle sert une galerie d'images statiques depuis
`public/generated` et choisit un rendu aleatoire dans la liste declaree dans `data/gallery.js`.

## Installation

```powershell
npm install
npm run dev
```

Puis ouvre :

```text
http://localhost:3000
```

## Ajouter des images plus tard

1. Copie les fichiers PNG/JPG dans `public/generated/`
2. Ajoute leurs metadonnees dans `data/gallery.js`
3. Push sur GitHub
4. Vercel redeploie automatiquement

## Deploiement Vercel

- Root Directory : `gan_nextjs`
- Framework Preset : `Next.js`
- Environment Variables : aucune pour cette version

Cette version est adaptee a un sous-domaine public comme `image.osso.website`.
