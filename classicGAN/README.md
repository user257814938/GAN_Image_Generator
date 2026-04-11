# classicGAN

Prototype local de Vanilla GAN entraîné sur `CIFAR-10` ou `SVHN`.

## Installation

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Si tu pars d'un clone GitHub

Quand tu clones le repo, tu récupères :

- le code ;
- les scripts d'entraînement et de génération ;
- la structure du projet.

En revanche, tu ne récupères pas automatiquement :

- `data/`
- `outputs/`
- `checkpoints/`

Ces dossiers sont ignorés par Git. Donc, après un clone GitHub, tu dois :

1. soit remettre un checkpoint manuellement dans `checkpoints/last.pt`
2. soit réentraîner le modèle

## Démarrage rapide

### Réentraînement court

```powershell
python train.py --preset smoke --dataset svhn
```

### Entraînement plus long

```powershell
python train.py --preset improved --dataset svhn
```

### Génération d'un aperçu

```powershell
python generate.py --checkpoint checkpoints/last.pt --num-images 16
```

## Export vers la vitrine web

```powershell
python export_vercel_gallery.py --count 50
```

Par défaut, ce script envoie les images vers :

```text
../showcase_web/public/generated/
../showcase_web/data/gallery.js
```

## Fichiers principaux

- `train.py` : entraîne le GAN et sauvegarde des échantillons PNG.
- `generate.py` : recharge un checkpoint et génère une grille d'images.
- `export_vercel_gallery.py` : exporte un lot d'images individuelles pour la vitrine web.
- `models.py` : architecture du générateur et du discriminateur.
- `config.py` : hyperparamètres par défaut et presets.
- `utils.py` : data loading, seed, sauvegarde de checkpoints et d'images.
