import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const CLASSIC_GAN_DIR = path.join(process.cwd(), "..", "classicGAN");
const CHECKPOINT_PATH = path.join(CLASSIC_GAN_DIR, "checkpoints", "last.pt");
const OUTPUT_DIR = path.join(CLASSIC_GAN_DIR, "outputs");

function resolvePythonCommand() {
  return process.platform === "win32" ? "python" : "python3";
}

export async function POST(request) {
  try {
    if (!existsSync(CHECKPOINT_PATH)) {
      return Response.json(
        { error: "Checkpoint introuvable dans classicGAN/checkpoints/last.pt." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const numImages = Math.min(Math.max(Number(body.numImages) || 16, 1), 64);
    const parsedSeed = Number(body.seed);
    const seed = Number.isFinite(parsedSeed) ? parsedSeed : 42;
    const imageName = `generated_${String(numImages).padStart(2, "0")}.png`;
    const imagePath = path.join(OUTPUT_DIR, imageName);

    await execFileAsync(
      resolvePythonCommand(),
      [
        "generate.py",
        "--checkpoint",
        "checkpoints/last.pt",
        "--num-images",
        String(numImages),
        "--seed",
        String(seed),
      ],
      {
        cwd: CLASSIC_GAN_DIR,
      },
    );

    if (!existsSync(imagePath)) {
      return Response.json(
        { error: "La generation s'est terminee sans produire de fichier image." },
        { status: 500 },
      );
    }

    return Response.json({
      imageName,
      seed,
      updatedAt: statSync(imagePath).mtimeMs,
      message: `Image generee avec ${numImages} vignettes et le seed ${seed}.`,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue pendant la generation." },
      { status: 500 },
    );
  }
}
