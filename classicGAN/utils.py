import csv
import random
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torchvision import datasets, transforms, utils


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def get_device() -> torch.device:
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def build_transform(dataset_name: str):
    transform_steps = []
    if dataset_name == "cifar10":
        transform_steps.append(transforms.RandomHorizontalFlip())

    transform_steps.extend(
        [
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
        ]
    )
    return transforms.Compose(transform_steps)


def create_dataloader(data_dir: str, batch_size: int, dataset_name: str, num_workers: int = 0):
    dataset_name = dataset_name.lower()
    dataset_root = Path(data_dir) / dataset_name

    if dataset_name == "cifar10":
        dataset = datasets.CIFAR10(
            root=str(dataset_root),
            train=True,
            download=True,
            transform=build_transform(dataset_name),
        )
    elif dataset_name == "svhn":
        dataset = datasets.SVHN(
            root=str(dataset_root),
            split="train",
            download=True,
            transform=build_transform(dataset_name),
        )
    else:
        raise ValueError(f"Unsupported dataset: {dataset_name}")

    return torch.utils.data.DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
    )


def prepare_output_dirs(base_dir: Path, output_dir: str, checkpoint_dir: str):
    output_path = base_dir / output_dir
    checkpoint_path = base_dir / checkpoint_dir
    output_path.mkdir(parents=True, exist_ok=True)
    checkpoint_path.mkdir(parents=True, exist_ok=True)
    return output_path, checkpoint_path


def save_image_grid(images: torch.Tensor, destination: Path, nrow: int = 4) -> None:
    grid = utils.make_grid(images.detach().cpu(), nrow=nrow, normalize=True, value_range=(-1, 1))
    utils.save_image(grid, destination)


def save_checkpoint(destination: Path, checkpoint: dict) -> None:
    torch.save(checkpoint, destination)


def load_checkpoint(path: Path, device: torch.device):
    return torch.load(path, map_location=device)


def append_metrics_row(csv_path: Path, row: dict) -> None:
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    file_exists = csv_path.exists()
    with csv_path.open("a", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(row.keys()))
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)


def init_weights(module: nn.Module) -> None:
    if isinstance(module, (nn.Conv2d, nn.Linear)):
        nn.init.normal_(module.weight, mean=0.0, std=0.02)
        if module.bias is not None:
            nn.init.constant_(module.bias, 0.0)
    elif isinstance(module, nn.BatchNorm2d):
        nn.init.normal_(module.weight, mean=1.0, std=0.02)
        nn.init.constant_(module.bias, 0.0)


def make_adversarial_targets(
    batch_size: int,
    device: torch.device,
    label_smoothing: float = 0.0,
    label_flip_prob: float = 0.0,
):
    real_targets = torch.ones(batch_size, 1, device=device)
    fake_targets = torch.zeros(batch_size, 1, device=device)

    if label_smoothing > 0:
        real_targets = real_targets - label_smoothing

    if label_flip_prob > 0:
        flip_mask = torch.rand(batch_size, 1, device=device) < label_flip_prob
        if flip_mask.any():
            real_targets = torch.where(flip_mask, fake_targets, real_targets)
            fake_targets = torch.where(flip_mask, torch.ones_like(fake_targets), fake_targets)

    return real_targets, fake_targets
