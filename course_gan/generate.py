import argparse
from pathlib import Path

import torch

from models import Generator
from utils import get_device, load_checkpoint, prepare_output_dirs, save_image_grid, set_seed


def parse_args():
    parser = argparse.ArgumentParser(description="Generate images from a trained GAN checkpoint.")
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--num-images", type=int, default=16)
    parser.add_argument("--latent-dim", type=int, default=None)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output-dir", default="outputs")
    return parser.parse_args()


def main():
    args = parse_args()
    base_dir = Path(__file__).resolve().parent
    device = get_device()
    set_seed(args.seed)

    checkpoint = load_checkpoint(Path(args.checkpoint), device)
    latent_dim = args.latent_dim or checkpoint.get("latent_dim") or checkpoint["config"]["latent_dim"]

    generator = Generator(latent_dim).to(device)
    generator.load_state_dict(checkpoint["generator_state_dict"])
    generator.eval()

    output_dir, _ = prepare_output_dirs(
        base_dir=base_dir,
        output_dir=args.output_dir,
        checkpoint_dir=checkpoint["config"].get("checkpoint_dir", "checkpoints"),
    )

    with torch.no_grad():
        noise = torch.randn(args.num_images, latent_dim, device=device)
        generated_images = generator(noise)

    output_path = output_dir / f"generated_{args.num_images:02d}.png"
    save_image_grid(generated_images, output_path)
    print(f"Saved generated images to {output_path}")


if __name__ == "__main__":
    main()
