# Course GAN

Prototype simple de GAN base sur le code du cours, entraine sur `CIFAR-10` ou `SVHN`.

## Commandes

```powershell
python train.py
python train.py --preset smoke
python train.py --preset improved --dataset svhn
python generate.py --checkpoint checkpoints/last.pt --num-images 16
```

## Fichiers

- `train.py` : entraine le GAN et sauvegarde des echantillons PNG.
- `generate.py` : recharge un checkpoint et genere une grille d'images.
- `models.py` : architecture du generateur et du discriminateur.
- `config.py` : hyperparametres par defaut et preset `smoke`.
- `utils.py` : data loading, seed, sauvegarde de checkpoints et d'images.

## Ameliorations d'entrainement

- choix du dataset avec `--dataset cifar10` ou `--dataset svhn` ;
- initialisation des poids pour stabiliser le depart ;
- label smoothing et petite proba de flip des labels ;
- `RandomHorizontalFlip` active uniquement pour `CIFAR-10`.
