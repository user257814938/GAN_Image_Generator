from copy import deepcopy


BASE_CONFIG = {
    "dataset": "cifar10",
    "data_dir": "data",
    "output_dir": "outputs",
    "checkpoint_dir": "checkpoints",
    "latent_dim": 100,
    "batch_size": 32,
    "lr": 0.0002,
    "beta1": 0.5,
    "beta2": 0.999,
    "num_epochs": 2,
    "sample_every": 250,
    "sample_num_images": 16,
    "seed": 42,
    "max_steps": None,
    "label_smoothing": 0.1,
    "label_flip_prob": 0.02,
    "num_workers": 0,
}


PRESETS = {
    "default": {
        "num_epochs": 10,
        "sample_every": 200,
    },
    "smoke": {
        "num_epochs": 1,
        "batch_size": 16,
        "sample_every": 2,
        "sample_num_images": 16,
        "max_steps": 4,
    },
    "improved": {
        "num_epochs": 15,
        "batch_size": 64,
        "sample_every": 150,
    },
}


def get_config(preset: str = "default") -> dict:
    if preset not in PRESETS:
        raise ValueError(f"Unknown preset: {preset}")

    config = deepcopy(BASE_CONFIG)
    config.update(PRESETS[preset])
    return config
