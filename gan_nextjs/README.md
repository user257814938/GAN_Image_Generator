# GAN Next.js UI

Interface Next.js locale pour piloter le prototype PyTorch situe dans `../classicGAN`.

## Installation

```powershell
npm install
npm run dev
```

## Usage

L'app suppose que le checkpoint existe deja ici :

```text
../classicGAN/checkpoints/last.pt
```

Puis ouvre :

```text
http://localhost:3000
```

Le bouton de generation execute :

```powershell
python generate.py --checkpoint checkpoints/last.pt --num-images <N> --seed <SEED>
```
