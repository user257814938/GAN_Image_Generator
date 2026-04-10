# GAN Next.js UI

Interface Next.js locale pour piloter le prototype PyTorch situé dans `../course_gan`.

## Installation

```powershell
npm install
npm run dev
```

## Usage

L'app suppose que le checkpoint existe déjà ici :

```text
../course_gan/checkpoints/last.pt
```

Puis ouvre :

```text
http://localhost:3000
```

Le bouton de génération exécute :

```powershell
python generate.py --checkpoint checkpoints/last.pt --num-images <N> --seed <SEED>
```
