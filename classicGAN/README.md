# classicGAN

Prototype local de Vanilla GAN entraine sur `CIFAR-10` ou `SVHN`.

## Installation

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Si tu pars d'un clone GitHub

Quand tu clones le repo, tu recuperes :

- le code ;
- les scripts d'entrainement et de generation ;
- la structure du projet.

En revanche, tu ne recuperes pas automatiquement :

- `data/`
- `outputs/`
- `checkpoints/`

Ces dossiers sont ignores par Git. Donc, apres un clone GitHub, tu dois :

1. soit remettre un checkpoint manuellement dans `checkpoints/last.pt`
2. soit reentrainer le modele

## Demarrage rapide

### Reentrainement court

```powershell
python train.py --preset smoke --dataset svhn
```

### Entrainement plus long

```powershell
python train.py --preset improved --dataset svhn
```

### Generation d'un apercu

```powershell
python generate.py --checkpoint checkpoints/last.pt --num-images 16
```

## Export vers la vitrine web

```powershell
python export_vercel_gallery.py --count 50
```

Par defaut, ce script envoie les images vers :

```text
../showcase_web/public/generated/
../showcase_web/data/gallery.js
```

## Fichiers principaux

- `train.py` : entraine le GAN et sauvegarde des echantillons PNG.
- `generate.py` : recharge un checkpoint et genere une grille d'images.
- `export_vercel_gallery.py` : exporte un lot d'images individuelles pour la vitrine web.
- `models.py` : architecture du generateur et du discriminateur.
- `config.py` : hyperparametres par defaut et presets.
- `utils.py` : data loading, seed, sauvegarde de checkpoints et d'images.
