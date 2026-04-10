# GAN Image Generator

Prototype de generation d'images avec PyTorch.

## Contenu

- `classicGAN/` : entrainement et generation d'images avec un GAN classique sur `CIFAR-10` ou `SVHN`.
- `gan_nextjs/` : interface Next.js locale pour afficher et relancer la generation depuis le checkpoint.
- `stylegan/` : dossier reserve pour une future implementation StyleGAN.

## Architecture globale

![Architecture globale du projet](classicGAN/workflow.png)

Fichier source du schema : [`classicGAN/workflow.png`](classicGAN/workflow.png)

## Lancer le projet

### Entrainement / generation Python

```powershell
cd classicGAN
python train.py --preset improved --dataset svhn
python generate.py --checkpoint checkpoints/last.pt --num-images 16
```

### Interface Next.js

```powershell
cd gan_nextjs
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.
