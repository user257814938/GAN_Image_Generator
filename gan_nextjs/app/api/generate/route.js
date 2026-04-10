import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const COURSE_GAN_DIR = path.join(process.cwd(), "..", "course_gan");
const CHECKPOINT_PATH = path.join(COURSE_GAN_DIR, "checkpoints", "last.pt");
const OUTPUT_DIR = path.join(COURSE_GAN_DIR, "outputs");

function resolvePythonCommand() {
  return process.platform === "win32" ? "python" : "python3";
}

export async function POST(request) {
  try {
    if (!existsSync(CHECKPOINT_PATH)) {
      return Response.json(
        { error: "Checkpoint introuvable dans course_gan/checkpoints/last.pt." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const numImages = Math.min(Math.max(Number(body.numImages) || 16, 1), 64);
    const seed = Number(body.seed) || 42;
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
        cwd: COURSE_GAN_DIR,
      },
    );

    if (!existsSync(imagePath)) {
      return Response.json(
        { error: "La génération s’est terminée sans produire de fichier image." },
        { status: 500 },
      );
    }

    return Response.json({
      imageName,
      updatedAt: statSync(imagePath).mtimeMs,
      message: `Image générée avec ${numImages} vignettes et le seed ${seed}.`,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue pendant la génération." },
      { status: 500 },
    );
  }
}
