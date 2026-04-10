import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

import GeneratePanel from "@/components/generate-panel";

const CLASSIC_GAN_DIR = path.join(process.cwd(), "..", "classicGAN");
const OUTPUT_DIR = path.join(CLASSIC_GAN_DIR, "outputs");
const CHECKPOINT_PATH = path.join(CLASSIC_GAN_DIR, "checkpoints", "last.pt");
const DEFAULT_IMAGE = "generated_16.png";

function getInitialState() {
  const imagePath = path.join(OUTPUT_DIR, DEFAULT_IMAGE);
  const hasImage = existsSync(imagePath);
  const hasCheckpoint = existsSync(CHECKPOINT_PATH);
  const imageUpdatedAt = hasImage ? statSync(imagePath).mtimeMs : Date.now();

  return {
    hasImage,
    hasCheckpoint,
    defaultImageName: DEFAULT_IMAGE,
    imageUpdatedAt,
  };
}

function getMetricsPreview() {
  const metricsPath = path.join(OUTPUT_DIR, "metrics.csv");
  if (!existsSync(metricsPath)) {
    return null;
  }

  const content = readFileSync(metricsPath, "utf8").trim().split(/\r?\n/);
  if (content.length < 2) {
    return null;
  }

  return content.at(-1) ?? null;
}

export default function Page() {
  const state = getInitialState();
  const metricsPreview = getMetricsPreview();

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Local GAN Studio</span>
        <h1>Une vraie interface pour ton generateur PyTorch.</h1>
        <p>
          Cette app Next.js pilote le script Python existant dans <code>classicGAN</code>,
          relance la generation a partir du checkpoint local et affiche directement l&apos;image
          produite, sans listing brut de fichiers.
        </p>
      </section>

      <GeneratePanel initialState={state} metricsPreview={metricsPreview} />
    </main>
  );
}
