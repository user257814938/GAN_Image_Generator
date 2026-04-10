import argparse
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim

from config import get_config
from models import Discriminator, Generator
from utils import (
    append_metrics_row,
    create_dataloader,
    get_device,
    init_weights,
    make_adversarial_targets,
    prepare_output_dirs,
    save_checkpoint,
    save_image_grid,
    set_seed,
)


def parse_args():
    parser = argparse.ArgumentParser(description="Train a simple GAN on CIFAR-10 or SVHN.")
    parser.add_argument("--preset", default="default", choices=["default", "smoke", "improved"])
    parser.add_argument("--dataset", default=None, choices=["cifar10", "svhn"])
    parser.add_argument("--epochs", type=int, default=None)
    parser.add_argument("--batch-size", type=int, default=None)
    parser.add_argument("--latent-dim", type=int, default=None)
    parser.add_argument("--lr", type=float, default=None)
    parser.add_argument("--sample-every", type=int, default=None)
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--output-dir", default=None)
    parser.add_argument("--data-dir", default=None)
    parser.add_argument("--max-steps", type=int, default=None)
    parser.add_argument("--label-smoothing", type=float, default=None)
    parser.add_argument("--label-flip-prob", type=float, default=None)
    parser.add_argument("--num-workers", type=int, default=None)
    return parser.parse_args()


def build_runtime_config(args):
    config = get_config(args.preset)
    overrides = {
        "num_epochs": args.epochs,
        "batch_size": args.batch_size,
        "latent_dim": args.latent_dim,
        "lr": args.lr,
        "dataset": args.dataset,
        "sample_every": args.sample_every,
        "seed": args.seed,
        "output_dir": args.output_dir,
        "data_dir": args.data_dir,
        "max_steps": args.max_steps,
        "label_smoothing": args.label_smoothing,
        "label_flip_prob": args.label_flip_prob,
        "num_workers": args.num_workers,
    }
    for key, value in overrides.items():
        if value is not None:
            config[key] = value
    return config


def main():
    args = parse_args()
    config = build_runtime_config(args)
    base_dir = Path(__file__).resolve().parent
    output_dir, checkpoint_dir = prepare_output_dirs(
        base_dir=base_dir,
        output_dir=config["output_dir"],
        checkpoint_dir=config["checkpoint_dir"],
    )
    metrics_csv = output_dir / "metrics.csv"

    set_seed(config["seed"])
    device = get_device()
    print(f"Using device: {device}")
    print(f"Dataset: {config['dataset']}")

    dataloader = create_dataloader(
        data_dir=str(base_dir / config["data_dir"]),
        batch_size=config["batch_size"],
        dataset_name=config["dataset"],
        num_workers=config["num_workers"],
    )

    generator = Generator(config["latent_dim"]).to(device)
    discriminator = Discriminator().to(device)
    generator.apply(init_weights)
    discriminator.apply(init_weights)
    adversarial_loss = nn.BCELoss()

    optimizer_g = optim.Adam(
        generator.parameters(),
        lr=config["lr"],
        betas=(config["beta1"], config["beta2"]),
    )
    optimizer_d = optim.Adam(
        discriminator.parameters(),
        lr=config["lr"],
        betas=(config["beta1"], config["beta2"]),
    )

    global_step = 0
    fixed_noise = torch.randn(config["sample_num_images"], config["latent_dim"], device=device)

    for epoch in range(config["num_epochs"]):
        for batch_index, batch in enumerate(dataloader, start=1):
            real_images = batch[0].to(device)
            batch_size = real_images.size(0)
            valid, fake = make_adversarial_targets(
                batch_size=batch_size,
                device=device,
                label_smoothing=config["label_smoothing"],
                label_flip_prob=config["label_flip_prob"],
            )

            optimizer_d.zero_grad()
            z = torch.randn(batch_size, config["latent_dim"], device=device)
            fake_images = generator(z)

            real_loss = adversarial_loss(discriminator(real_images), valid)
            fake_loss = adversarial_loss(discriminator(fake_images.detach()), fake)
            d_loss = (real_loss + fake_loss) / 2
            d_loss.backward()
            optimizer_d.step()

            optimizer_g.zero_grad()
            gen_images = generator(z)
            g_loss = adversarial_loss(discriminator(gen_images), valid)
            g_loss.backward()
            optimizer_g.step()

            global_step += 1
            append_metrics_row(
                metrics_csv,
                {
                    "epoch": epoch + 1,
                    "batch": batch_index,
                    "global_step": global_step,
                    "dataset": config["dataset"],
                    "d_loss": float(d_loss.item()),
                    "g_loss": float(g_loss.item()),
                },
            )

            if global_step % config["sample_every"] == 0:
                with torch.no_grad():
                    sample_images = generator(fixed_noise)
                sample_path = output_dir / f"sample_step_{global_step:04d}.png"
                save_image_grid(sample_images, sample_path)
                print(f"Saved sample to {sample_path}")

            if batch_index % 50 == 0 or batch_index == 1:
                print(
                    f"Epoch [{epoch + 1}/{config['num_epochs']}] "
                    f"Batch [{batch_index}/{len(dataloader)}] "
                    f"D Loss: {d_loss.item():.4f} "
                    f"G Loss: {g_loss.item():.4f}"
                )

            if config["max_steps"] is not None and global_step >= config["max_steps"]:
                break

        checkpoint = {
            "epoch": epoch + 1,
            "global_step": global_step,
            "latent_dim": config["latent_dim"],
            "generator_state_dict": generator.state_dict(),
            "discriminator_state_dict": discriminator.state_dict(),
            "optimizer_g_state_dict": optimizer_g.state_dict(),
            "optimizer_d_state_dict": optimizer_d.state_dict(),
            "config": config,
        }
        save_checkpoint(checkpoint_dir / "last.pt", checkpoint)

        with torch.no_grad():
            epoch_images = generator(fixed_noise)
        save_image_grid(epoch_images, output_dir / f"sample_epoch_{epoch + 1:03d}.png")

        if config["max_steps"] is not None and global_step >= config["max_steps"]:
            print("Reached max steps for this run.")
            break

    print(f"Training finished. Checkpoint saved to {checkpoint_dir / 'last.pt'}")


if __name__ == "__main__":
    main()
