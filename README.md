# GAN Image Generator

Prototype de génération d'images avec PyTorch.

## Contenu

- `course_gan/` : entraînement et génération d'images avec un GAN simple sur `CIFAR-10` ou `SVHN`.
- `gan_nextjs/` : interface Next.js locale pour afficher et relancer la génération depuis le checkpoint.
- `stylegan/` : dossier réservé pour une future implémentation StyleGAN.

## Lancer le projet

### Entraînement / génération Python

```powershell
cd course_gan
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
