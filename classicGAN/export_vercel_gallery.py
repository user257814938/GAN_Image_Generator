import argparse
import json
from pathlib import Path

import torch
from torchvision import utils as tv_utils

from models import Generator
from utils import get_device, load_checkpoint, set_seed


def parse_args():
    parser = argparse.ArgumentParser(
        description="Export a fixed set of classicGAN images to the Next.js Vercel gallery."
    )
    parser.add_argument("--checkpoint", default="checkpoints/last.pt")
    parser.add_argument("--count", type=int, default=50)
    parser.add_argument("--seed-start", type=int, default=1001)
    parser.add_argument(
        "--target-dir",
        default="../showcase_web/public/generated",
        help="Directory where the individual images will be written.",
    )
    parser.add_argument(
        "--gallery-file",
        default="../showcase_web/data/gallery.js",
        help="JS manifest file consumed by the Next.js app.",
    )
    return parser.parse_args()


def save_single_image(image_tensor: torch.Tensor, destination: Path) -> None:
    tv_utils.save_image(
        image_tensor.detach().cpu(),
        destination,
        normalize=True,
        value_range=(-1, 1),
    )


def build_gallery_content(entries: list[dict]) -> str:
    payload = json.dumps(entries, indent=2)
    payload = payload.replace('"', "'")
    return f"export const galleryImages = {payload};\n"


def main():
    args = parse_args()
    base_dir = Path(__file__).resolve().parent
    checkpoint_path = (base_dir / args.checkpoint).resolve()
    target_dir = (base_dir / args.target_dir).resolve()
    gallery_file = (base_dir / args.gallery_file).resolve()

    device = get_device()
    checkpoint = load_checkpoint(checkpoint_path, device)
    latent_dim = checkpoint.get("latent_dim") or checkpoint["config"]["latent_dim"]
    dataset_name = str(checkpoint.get("config", {}).get("dataset", "unknown")).upper()

    generator = Generator(latent_dim).to(device)
    generator.load_state_dict(checkpoint["generator_state_dict"])
    generator.eval()

    target_dir.mkdir(parents=True, exist_ok=True)
    for old_image in target_dir.glob("*"):
        if old_image.is_file():
            old_image.unlink()

    entries = []

    with torch.no_grad():
        for index in range(args.count):
            seed = args.seed_start + index
            set_seed(seed)
            noise = torch.randn(1, latent_dim, device=device)
            generated_image = generator(noise)

            file_name = f"classicgan-{index + 1:03d}.png"
            destination = target_dir / file_name
            save_single_image(generated_image[0], destination)

            entries.append(
                {
                    "src": f"/generated/{file_name}",
                    "title": f"classicGAN sample {index + 1:03d}",
                    "seed": seed,
                    "dataset": dataset_name,
                    "model": "classicGAN",
                }
            )

    gitkeep_path = target_dir / ".gitkeep"
    gitkeep_path.write_text("", encoding="utf-8")
    gallery_file.write_text(build_gallery_content(entries), encoding="utf-8")

    print(f"Exported {args.count} images to {target_dir}")
    print(f"Updated gallery manifest at {gallery_file}")


if __name__ == "__main__":
    main()
